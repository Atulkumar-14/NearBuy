from flask import Blueprint, request, jsonify
from models import db, Admin, User, Shop, Product, ProductCategory
import jwt, datetime, os
from functools import wraps
from dotenv import load_dotenv

load_dotenv()
bp = Blueprint("admin", __name__)

# --- Helpers ---
def admin_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            data = jwt.decode(
                token,
                os.getenv("SECRET_KEY", "dev_key_change_in_production"),
                algorithms=["HS256"],
            )
            current_admin = Admin.query.filter_by(userId=data["userId"]).first()
            if not current_admin:
                return jsonify({"message": "Invalid token"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except Exception:
            return jsonify({"message": "Invalid token"}), 401

        return f(current_admin, *args, **kwargs)

    return decorated


# --- Init admin (run only once) ---
@bp.route("/init", methods=["POST"])
def init_admin():
    if Admin.query.first():
        return jsonify({"message": "Admin already initialized"}), 400

    admin = Admin(
        userId=os.getenv("ADMIN_USERNAME", "admin"),
        password=os.getenv("ADMIN_PASSWORD", "admin123"),
    )
    db.session.add(admin)
    db.session.commit()
    return jsonify({"message": "Admin initialized successfully"}), 201


# --- Login ---
@bp.route("/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    if not data or not data.get("userId") or not data.get("password"):
        return jsonify({"message": "Missing userId or password"}), 400

    admin = Admin.query.filter_by(userId=data["userId"]).first()
    if not admin or not admin.check_password(data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode(
        {
            "userId": admin.userId,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        },
        os.getenv("SECRET_KEY", "dev_key_change_in_production"),
        algorithm="HS256",
    )

    return jsonify({"token": token, "admin": admin.to_dict()}), 200


# --- Validate token ---
@bp.route("/validate-token", methods=["GET"])
@admin_token_required
def validate_admin_token(current_admin):
    return jsonify({"valid": True, "admin": current_admin.to_dict()}), 200


# --- Analytics ---
@bp.route("/analytics", methods=["GET"])
@admin_token_required
def get_analytics(current_admin):
    from sqlalchemy import func
    
    # Get counts
    user_count = User.query.count()
    shop_count = Shop.query.count()
    category_count = ProductCategory.query.count()
    product_count = Product.query.count()
    
    # Get recent data (last 7 days)
    from datetime import datetime, timedelta
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    recent_users = User.query.filter(User.created_at >= seven_days_ago).count()
    recent_shops = Shop.query.filter(Shop.created_at >= seven_days_ago).count()
    
    # Get shop categories distribution
    shop_categories = db.session.query(
        ProductCategory.name,
        func.count(Shop.shop_id).label('count')
    ).join(Shop, ProductCategory.category_id == Shop.category_id, isouter=True).group_by(ProductCategory.name).all()
    
    # Get top cities by shop count
    top_cities = db.session.query(
        Shop.city,
        func.count(Shop.shop_id).label('count')
    ).group_by(Shop.city).order_by(func.count(Shop.shop_id).desc()).limit(5).all()
    
    return jsonify({
        "user_count": user_count,
        "shop_count": shop_count,
        "category_count": category_count,
        "product_count": product_count,
        "recent_users": recent_users,
        "recent_shops": recent_shops,
        "shop_categories": [{"name": name or "Uncategorized", "count": count} for name, count in shop_categories],
        "top_cities": [{"city": city or "Unknown", "count": count} for city, count in top_cities]
    }), 200


# --- Users ---
@bp.route("/users", methods=["GET"])
@admin_token_required
def get_all_users(current_admin):
    users = User.query.all()
    return jsonify(
        [
            {
                "user_id": u.user_id,
                "name": u.name,
                "email": u.email,
                "phone": u.phone,
                "created_at": u.created_at.isoformat() if u.created_at else None,
            }
            for u in users
        ]
    ), 200


@bp.route("/users/<int:user_id>", methods=["DELETE"])
@admin_token_required
def delete_user(current_admin, user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200


# --- Shops ---
@bp.route("/shops", methods=["GET"])
@admin_token_required
def get_all_shops(current_admin):
    shops = Shop.query.all()
    return jsonify(
        [
            {
                "shop_id": s.shop_id,
                "name": s.name,
                "owner_name": s.owner.name if hasattr(s, "owner") and s.owner else None,
                "category_name": s.category.name if hasattr(s, "category") and s.category else None,
                "created_at": s.created_at.isoformat() if s.created_at else None,
            }
            for s in shops
        ]
    ), 200


@bp.route("/shops/<int:shop_id>", methods=["DELETE"])
@admin_token_required
def delete_shop(current_admin, shop_id):
    shop = Shop.query.get_or_404(shop_id)
    db.session.delete(shop)
    db.session.commit()
    return jsonify({"message": "Shop deleted successfully"}), 200
