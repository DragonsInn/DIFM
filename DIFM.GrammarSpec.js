var emailRegex = require("email-regex")({exact: true});
var urlRegex = require("url-regex")({exact: true});

/**
 * Missing:
 * - Attribute definition. Eg, assigning a class to a paragraph.
 * - Proper directives (is a FIXME)
 * - Paragraphs
 * - Testing, if this thing even works? XD
 */

module.exports = {
    rules: {
        // " " or "\t"
        whitespace: /\s*/,
        // New line
        newline: /[\n]/,

        // A word. There is likely a better way to do this ^^;
        word: /[^\s]/,

        // Match an URL or IP
        url: urlRegex,
        // Mach an email address
        email: emailRegex,

        // @user style mentions
        mention: {
            components: [
                { character: "@" },
                {
                    as: "username",
                    name: /[0-9a-zA-Z,.-_]/
                }
            ]
        },

        // #IDoRegexAlthoughICant.
        hashtag: {
            components: [
                { character: "#" },
                {
                    as: "tag",
                    name: "word"
                }
            ]
        },

        // inline:

        // _foo_ or *foo*
        italic: {
            components: [
                /(_|\*)/,
                { oneOrMoreOf: "word", as: "text" },
                /(_|\*)/
            ]
        },

        // __foo__ or **foo**
        bold: {
            components: [
                /(_|\*){2}/,
                { oneOrMoreOf: "word", as: "text" },
                /(_|\*){2}/
            ]
        },

        // --derp--
        strikethrough: {
            components: [
                { character: "--" },
                { oneOrMoreOf: "word", as: "text" },
                { character: "--" },
            ]
        },

        // `code`
        code: {
            components: [
                { character: "`" },
                { oneOrMoreOf: "word", as: "text" },
                { character: "`" },
            ]
        },

        // [title](url)
        link: {
            components: [
                // Title part
                { character: "[" },
                { oneOrMoreOf: "word", as: "title" },
                { character: "]" },
                // Link part
                { character: "(" },
                { oneOf: ["url","email"], as: "url" },
                { character: ")" }
            ]
        },

        // ![alt](url)
        image: {
            components: [
                { character: "!" },
                { name: "link" }
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
                { name: "whitespace" },
                { oneOrMoreOf: ["word", "whitespace"] },
                /(.+?[^\n]*)/ // All but newline.
            ]
        },

        // > quoting...
        quote: {
            components: [
                /(>)*/,
                { name: "whitespace" },
                { oneOrMoreOf: ["word", "whitespace"] },
                /(.+?[^\n]*)/
            ]
        },

        // # heading level 1
        heading: {
            components: {
                /(#){1,6}/,
                { name: "whitespace" },
                { oneOrMoreOf: ["word", "whitespace"] },
                /(.+?[^\n]*)/
            }
        }

        // Multiline

        // Several words and a single newline make a paragraph.
        // But, how to best handle 2 newlines? One newline should cause <br>,
        // and two should cause the paragraph to be closed.
        // FIXME: Ask @asmblah
        textblock: {
            components: [
                { oneOrMany: ["word", "whitespace"] },
                { name: "newline" }
            ]
        },
        paragraph: {
            components: [
                { name: "textblock" },
                { name: "newline" }
            ]
        },

        codeblock: {
            components: [
                /(`){3}/,
                { name: "word", as: "language" },
                { name: "newline" },
                /(.*[^```])*/, // as: code?
                { name: "newline" }
            ]
        },

        quoteblock: {
            components: [
                /(~){3}/,
                { name: "word", as: "author" },
                { name: "newline" },
                /(.*[^```])*/, // as: text?
                { name: "newline" }
            ]
        }
    }
}
