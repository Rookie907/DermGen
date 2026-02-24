import os

import uvicorn
from app import app


def load_env_from_file(path: str = ".env") -> None:
  if not os.path.exists(path):
      return

  with open(path, "r", encoding="utf-8") as f:
      for line in f:
          line = line.strip()
          if not line or line.startswith("#") or "=" not in line:
              continue
          key, value = line.split("=", 1)
          os.environ.setdefault(key.strip(), value.strip())


if __name__ == "__main__":
    # Minimal .env loader without external dependencies
    load_env_from_file()

    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)

