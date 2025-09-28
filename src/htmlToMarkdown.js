const cheerio = require('cheerio');

function normalizeWhitespace(text) {
    return text.replace(/\s+/g, ' ').trim();
}

function wrapInline(text) {
    return text.replace(/\s+/g, ' ');
}

function renderInline($, node) {
    if (node.type === 'text') {
        return wrapInline(node.data || '');
    }

    if (node.type === 'comment') {
        return '';
    }

    const children = [];
    node.children && node.children.forEach(child => {
        children.push(renderInline($, child));
    });
    const content = children.join('');

    switch (node.name) {
        case 'em':
        case 'i':
            return content ? `*${content}*` : '';
        case 'strong':
        case 'b':
            return content ? `**${content}**` : '';
        case 'code':
            return content ? `\`${content}\`` : '';
        case 'a': {
            const href = $(node).attr('href');
            return href ? `[${content || href}](${href})` : content;
        }
        case 'span':
            if ($(node).hasClass('tex-math') || $(node).hasClass('tex-span')) {
                const mathText = normalizeWhitespace($(node).text());
                return mathText ? `$${mathText}$` : '';
            }
            return content;
        case 'sup':
            return content ? `^${content}` : '';
        case 'sub':
            return content ? `_${content}` : '';
        default:
            return content;
    }
}

function renderBlock($, node, depth = 0) {
    if (node.type === 'text') {
        return normalizeWhitespace(node.data || '') + '\n\n';
    }

    if (node.type === 'comment') {
        return '';
    }

    const $node = $(node);
    const children = [];
    node.children && node.children.forEach(child => {
        children.push(renderBlock($, child, depth + 1));
    });
    const childContent = children.join('');

    switch (node.name) {
        case 'p':
            return `${renderInline($, node)}\n\n`;
        case 'br':
            return '  \n';
        case 'ul': {
            return node.children
                .filter(child => child.type !== 'text' || normalizeWhitespace(child.data))
                .map(child => renderListItem($, child, depth, '-'))
                .join('') + '\n';
        }
        case 'ol': {
            let index = 1;
            return node.children
                .filter(child => child.type !== 'text' || normalizeWhitespace(child.data))
                .map(child => renderListItem($, child, depth, `${index++}.`))
                .join('') + '\n';
        }
        case 'li': {
            const marker = depth ? '  '.repeat(depth - 1) + '-' : '-';
            const body = node.children ? node.children.map(child => renderBlock($, child, depth + 1)).join('').trim() : '';
            return `${marker} ${body}\n`;
        }
        case 'pre': {
            const code = $node.text().replace(/\s+$/, '');
            return `\n\n\`\`\`text\n${code}\n\`\`\`\n\n`;
        }
        case 'code':
            return `\`${renderInline($, node)}\``;
        case 'div': {
            if ($node.hasClass('section-title')) {
                const title = normalizeWhitespace($node.text());
                return title ? `### ${title}\n\n` : '';
            }
            return childContent;
        }
        case 'span':
            return renderInline($, node);
        case 'table':
        case 'tbody':
        case 'tr':
        case 'td':
        case 'th':
            return normalizeWhitespace($node.text()) + '\n\n';
        default:
            return childContent;
    }
}

function renderListItem($, node, depth, marker) {
    if (node.type === 'text') {
        const text = normalizeWhitespace(node.data || '');
        return text ? `${marker} ${text}\n` : '';
    }
    const $node = $(node);
    if (node.name !== 'li') {
        return renderBlock($, node, depth + 1);
    }
    const body = node.children ? node.children.map(child => renderBlock($, child, depth + 2)).join('').trim() : '';
    const prefix = depth ? '  '.repeat(depth) + marker : marker;
    return `${prefix} ${body}\n`;
}

function htmlFragmentToMarkdown(htmlFragment) {
    const $ = cheerio.load(`<root>${htmlFragment}</root>`);
    const root = $('root')[0];
    if (!root || !root.children) {
        return '';
    }
    const parts = root.children.map(child => renderBlock($, child)).join('');
    return parts.replace(/\n{3,}/g, '\n\n').trim();
}

module.exports = {
    htmlFragmentToMarkdown,
};

