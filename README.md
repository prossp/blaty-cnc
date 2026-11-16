# Blaty CNC — PWA

Aplikacja działa w 100% lokalnie; pliki DXF nie opuszczają urządzenia.

**Publikacja (GitHub Pages):** wrzuć zawartość katalogu `pwa/` do repozytorium (np. do folderu `docs/` lub osobnego repo),
w Settings → Pages wskaż gałąź i folder. Wszystkie ścieżki są względne, więc działa z podścieżki `https://użytkownik.github.io/repo/`.

**Instalacja na Androidzie:** otwórz adres w Chrome → menu ⋮ → „Dodaj do ekranu głównego" / „Zainstaluj aplikację".

**Udostępnianie do aplikacji:** „Blaty CNC" pojawi się na liście „Udostępnij" (np. z menedżera plików lub poczty) dla plików DXF.
Share target działa dopiero po zainstalowaniu PWA i tylko przez HTTPS (service worker musi być aktywny).
Po udostępnieniu plik jest wczytywany, a przy warstwie BLATY_KUCHENNE przetwarzany automatycznie; wynik można udostępnić dalej przyciskiem „Udostępnij wynik".
Po zmianach w plikach podbij `CACHE` w `sw.js` (np. `blaty-cnc-v3`).
Ikony generuje `python make_icons.py`.
