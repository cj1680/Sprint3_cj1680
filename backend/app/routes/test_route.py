from flask import Blueprint
from flask import jsonify

bp = Blueprint("test", __name__, url_prefix="/test")

@bp.route("/")
def test():
    return jsonify("Success")
