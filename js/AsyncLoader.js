"use strict";
function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}
class AsyncLoader {
    constructor(output, level = 0) {
        this.cache = new Map();
        this.output = output || document.body;
        this.level = level;
        this._InitEvents();
        this._InitialLoad();
    }
    _InitialLoad() {
        // debugger
        const normalizedHash = location.hash
            .replace(/^#/, "")
            .replace(/\/$/, "")
            .split("/")[this.level];
        const a = document.querySelector(`a.async-link-${this.level}[data-hash="${normalizedHash}"]`);
        if (a) {
            this.onLink(a.href, a.getAttribute("data-hash"), new Event("click"));
        }
    }
    _InitEvents() {
        document.querySelectorAll(`a.async-link-${this.level}`).forEach(link => {
            const href = link.getAttribute("href");
            const hash = link.getAttribute("data-hash");
            if (!href) {
                console.error(`[AsyncLoader]> "href" attribute not found on: `, link);
                return;
            }
            if (!hash) {
                console.error(`[AsyncLoader]> "data-hash" attribute not found on: `, link);
                return;
            }
            link.addEventListener("click", this.onLink.bind(this, href, hash));
        });
    }
    onPopState(e) {
        debugger;
    }
    onLink(path, hash, e) {
        if (e.isTrusted) {
            e.preventDefault();
            e.stopPropagation();
        }
        // history.pushState({path, hash}, hash, path)
        const fromCache = this.cache.get(hash);
        if (fromCache)
            this.loadHTML(hash, fromCache);
        else {
            this.fetchHTML(path)
                .then(html => {
                this.cache.set(hash, html);
                return html;
            })
                .then(html => this.loadHTML(hash, html))
                .catch(err => {
                alert(`[AsyncLoader]> Error loading ${path}; Details in the console`);
                console.error(`[AsyncLoader]> ${err}`);
            });
        }
    }
    loadHTML(hash, html) {
        const oldHash = document.location.hash
            .replace(/^#/, "")
            .replace(/\/$/, "")
            .split("/");
        oldHash[this.level] = hash;
        document.location.hash = oldHash.join("/");
        this.output.innerHTML = "";
        for (const node of htmlToElements(html)) {
            if (node.nodeName === "SCRIPT") {
                debugger;
                try {
                    eval(node.innerHTML);
                }
                catch (err) {
                    console.error(`Error evaluating ${node.innerHTML}`);
                }
            }
            this.output.appendChild(node);
        }
    }
    fetchHTML(url) {
        return fetch(url, {
            method: "GET",
            redirect: "follow"
        }).then(f => f.text())
            .catch(err => {
            console.error(err);
            return "";
        });
    }
}
