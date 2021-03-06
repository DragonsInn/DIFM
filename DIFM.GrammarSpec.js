var emailRegex = require("email-regex")({exact: true});
var urlRegex = require("url-regex")({exact: true});

/**
 * Missing:
 * - Attribute definition. Eg, assigning a class to a paragraph.
 * - Proper directives (is a FIXME)
 * - Paragraphs
 * - Testing, if this thing even works? XD
 */

var grammarSpec = {
    rules: {
        // " " or "\t"
        whitespace: /\s*/,
        // New line
        newline: /[\n]/,

        // A word. There is likely a better way to do this ^^;
        word: /[^\s]+/,

        // Match an URL or IP
        url: urlRegex,
        // Mach an email address
        email: emailRegex,

        // @user style mentions
        mention: {
            components: [
                /@/,
                {
                    name: "username",
                    what: /[0-9a-zA-Z,.-_]/
                }
            ]
        },

        // #IDoRegexAlthoughICant.
        hashtag: {
            components: [
                /#/,
                {
                    name: "tag",
                    rule: "word"
                }
            ]
        },

        // inline:

        // _foo_ or *foo*
        italic: {
            components: [
                /(_|\*)/,
                { oneOrMoreOf: "word", name: "text" },
                /(_|\*)/
            ]
        },

        // __foo__ or **foo**
        bold: {
            components: [
                /(_|\*){2}/,
                { oneOrMoreOf: "word", name: "text" },
                /(_|\*){2}/
            ]
        },

        // --derp--
        strikethrough: {
            components: [
                /--/,
                { oneOrMoreOf: "word", name: "text" },
                /--/,
            ]
        },

        // `code`
        code: {
            components: [
                /`/,
                { oneOrMoreOf: "word", name: "text" },
                /`/,
            ]
        },

        // [title](url)
        link: {
            components: [
                // Title part
                /\[/,
                { oneOrMoreOf: "word", name: "title" },
                /\]/,
                // Link part
                /\(/,
                { oneOf: ["url","email"], name: "url" },
                /\)/
            ]
        },

        // ![alt](url)
        image: {
            components: [
                /!/,
                "link"
            ]
        },

        // <directive:value>text</directive>
        // Basically, crushed HTML.
        // FIXME: Ask @asmblah: How to best define this, without redefining each directive?

        // Line-based

        // - A todo thing.
        bulletin: {
            components: [
                /(-|\*)/,
                "whitespace",
                { oneOrMoreOf: ["word", "whitespace"] },
                /(.+?[^\n])*/ // All but newline.
            ]
        },

        // > quoting...
        quote: {
            components: [
                /(>)*/,
                "whitespace",
                { oneOrMoreOf: ["word", "whitespace"] },
                /(.+?[^\n]*)/
            ]
        },

        // # heading level 1
        heading: {
            components: [
                { name: "level", what: /(#){1,6}/ },
                "whitespace",
                { name: "text", what: /.*/ },
                "whitespace"
            ],
            processor: function (node) {
                node.level = node.level.length;
                return node;
            }
        },

        // Multiline

        // Several words and a single newline make a paragraph.
        // But, how to best handle 2 newlines? One newline should cause <br>,
        // and two should cause the paragraph to be closed.
        // FIXME: Ask @asmblah
        textblock: {
            components: [
                { oneOrMoreOf: ["word", "whitespace"] },
                "newline"
            ]
        },
        paragraph: {
            components: [
                {
                    name: "lines",
                    oneOrMoreOf: {
                        what: /(.+)([\r\n]|$)/,
                        captureIndex: 1
                    }
                },
                /[\r\n]|$/
            ]
        },

        codeblock: {
            components: [
                /(`){3}/,
                { rule: "word", name: "language" },
                "newline",
                { what: /(.*[^```])*/, name: "code"},
                "newline"
            ]
        },

        quoteblock: {
            components: [
                /(~){3}/,
                { rule: "word", name: "author" },
                "newline",
                { what: /(.*[^```])*/, name: "text"},
                "newline"
            ]
        },

        document: {
            components: {
                name: "chunks",
                zeroOrMoreOf: {
                    oneOf: [
                        "heading",
                        "paragraph",
                        "codeblock",
                        "quoteblock"
                    ]
                }
            }
        }
    },
    start: "document"
};

module.exports = grammarSpec;
