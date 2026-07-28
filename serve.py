import gzip, io, os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

COMPRESSIBLE = {".html", ".css", ".js", ".mjs", ".json", ".xml", ".svg", ".txt"}
LONG_CACHE = {".png", ".jpg", ".jpeg", ".webp", ".woff2", ".mp4"}

class SEOHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        if self.path in ("/", "/index.html") or "diagnostic.html" in self.path:
            self.send_header("Cache-Control", "no-store")
        elif not getattr(self, "_cache_header_sent", False):
            ext = getattr(self, "_resolved_ext", None)
            if ext is None:
                ext = os.path.splitext(self.path.split("?")[0])[1]
            if ext in LONG_CACHE:
                self.send_header("Cache-Control", "public, max-age=31536000, immutable")
            elif ext in COMPRESSIBLE:
                self.send_header("Cache-Control", "public, max-age=3600")
        super().end_headers()

    def send_head(self):
        self._cache_header_sent = False
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            for index in ("index.html", "index.htm"):
                candidate = os.path.join(path, index)
                if os.path.isfile(candidate):
                    path = candidate
                    break
        ext = os.path.splitext(path)[1]
        self._resolved_ext = ext
        accept_enc = self.headers.get("Accept-Encoding", "")
        if ext in COMPRESSIBLE and "gzip" in accept_enc and os.path.isfile(path):
            with open(path, "rb") as f:
                data = f.read()
            buf = io.BytesIO()
            with gzip.GzipFile(fileobj=buf, mode="wb", mtime=0) as gz:
                gz.write(data)
            body = buf.getvalue()
            self.send_response(200)
            self.send_header("Content-Type", self.guess_type(path))
            self.send_header("Content-Encoding", "gzip")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Vary", "Accept-Encoding")
            if self.path in ("/", "/index.html") or "diagnostic.html" in self.path:
                self.send_header("Cache-Control", "no-store")
            elif ext in LONG_CACHE:
                self.send_header("Cache-Control", "public, max-age=31536000, immutable")
            else:
                self.send_header("Cache-Control", "public, max-age=3600")
            self._cache_header_sent = True
            self.end_headers()
            return io.BytesIO(body)
        return super().send_head()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = ThreadingHTTPServer(("0.0.0.0", 8080), SEOHandler)
    print("Serving on http://localhost:8080")
    server.serve_forever()
