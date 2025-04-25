from flask import Blueprint

bp = Blueprint("", __name__, url_prefix="/")

@bp.route("/", methods=["GET"])
def ping():
    return "pong"
