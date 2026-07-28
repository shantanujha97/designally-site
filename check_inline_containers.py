from playwright.sync_api import sync_playwright

classes = ['framer-10dwau-container','framer-16c7qva-container','framer-1ly2uwe-container',
           'framer-4qrzgj-container','framer-5kkw1k-container','framer-fk9jnq-container']

with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, url in [("local", "http://localhost:8080/"), ("live", "https://www.designally.xyz/")]:
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(url, wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2500)
        print(f"--- {name} ---")
        for cls in classes:
            el = page.query_selector(f".{cls}")
            if el is None:
                print(cls, "NOT FOUND")
                continue
            html_inner = el.evaluate("e => e.innerHTML")
            print(cls, "->", html_inner[:150])
        print("errors:", errors)
        page.close()
    browser.close()
