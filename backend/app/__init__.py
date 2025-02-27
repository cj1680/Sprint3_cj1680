from flask import Flask
from app.routes import test_route, graph_route, geometry_route, algebra_route

def create_app():
    app = Flask(__name__)

    # Register Blueprints
    app.register_blueprint(test_route.bp)
    app.register_blueprint(graph_route.bp)
    app.register_blueprint(geometry_route.bp)
    app.register_blueprint(algebra_route.bp)

    return app