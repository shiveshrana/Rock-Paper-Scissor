#!/usr/bin/env python3
"""
Simple Python web server to deploy the Rock Paper Scissors game.

Usage:
    python3 server.py [port]

Then open http://localhost:<port> in your browser (default port: 8000).
"""

import http.server
import socketserver
import sys
import os

DEFAULT_PORT = 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serves files from the same directory as this script, regardless
    of the current working directory the script is launched from."""

    def __init__(self, *args, **kwargs):
        directory = os.path.dirname(os.path.abspath(__file__))
        super().__init__(*args, directory=directory, **kwargs)

    def end_headers(self):
        # Prevent aggressive caching while developing
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        super().end_headers()


def main():
    port = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port '{sys.argv[1]}', using default {DEFAULT_PORT}.")

    with socketserver.TCPServer(("", port), Handler) as httpd:
        url = f"http://localhost:{port}"
        print(f"Serving Rock Paper Scissors at {url}")
        print("Press Ctrl+C to stop the server.")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.shutdown()


if __name__ == "__main__":
    main()