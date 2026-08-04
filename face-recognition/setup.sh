#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

PYTHON=$(command -v python3)
echo "Использую Python: $PYTHON"

# Пробуем создать venv, если это возможно
if [ ! -d ".venv" ] && "$PYTHON" -m venv --help >/dev/null 2>&1; then
    if "$PYTHON" -m venv .venv 2>/dev/null; then
        echo "Venv создан: .venv"
        .venv/bin/pip install --upgrade pip
        .venv/bin/pip install -r requirements.txt
        echo ""
        echo "Готово! Запуск сервиса:"
        echo "  npm run face"
        exit 0
    fi
fi

echo "venv недоступен — ставлю в пользовательское окружение (pip --user)"
"$PYTHON" -m pip install --user --break-system-packages --upgrade pip
"$PYTHON" -m pip install --user --break-system-packages -r requirements.txt
echo ""
echo "Готово! Запуск сервиса:"
echo "  npm run face"
echo "Модель buffalo_l (~500 МБ) скачается при первом запуске в ~/.insightface"