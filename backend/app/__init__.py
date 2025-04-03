from flask import Flask
from app.routes import graph_route, geometry_route, algebra_route, login, register

def create_app():
    app = Flask(__name__)

    # Register Blueprints
    app.register_blueprint(graph_route.bp)
    app.register_blueprint(geometry_route.bp)
    app.register_blueprint(algebra_route.bp)
    app.register_blueprint(login.bp)
    app.register_blueprint(register.bp)

    return app