const cheerio = require('cheerio');
const { htmlFragmentToMarkdown } = require('./htmlToMarkdown');

async function getProblemDetails(fetchPage, contestId, problemIndex) {
    const problemPath = `/contest/${contestId}/problem/${problemIndex}`;
    const html = await fetchPage(problemPath, { kind: 'problem', index: problemIndex });
    const $ = cheerio.load(html);
    const statement = $('.problem-statement');

    if (!statement.length) {
        throw new Error(`Unable to find problem statement for ${problemIndex}`);
    }

    const titleText = statement.find('.header .title').text().trim();
    const titleMatch = titleText.match(/^([A-Z][0-9A-Z]*)\.\s*(.*)$/);
    const problemName = titleMatch ? titleMatch[2] : titleText;

    const timeLimit = statement.find('.time-limit').text().replace(/\s+/g, ' ').trim();
    const memoryLimit = statement.find('.memory-limit').text().replace(/\s+/g, ' ').trim();
    const inputFile = statement.find('.input-file').text().replace(/\s+/g, ' ').trim();
    const outputFile = statement.find('.output-file').text().replace(/\s+/g, ' ').trim();

    const problemDescription = [];
    statement.children().each((_, element) => {
        const $el = $(element);
        if ($el.hasClass('header') || $el.hasClass('time-limit') || $el.hasClass('memory-limit') || $el.hasClass('input-file') || $el.hasClass('output-file') || $el.hasClass('input-specification') || $el.hasClass('output-specification') || $el.hasClass('sample-tests') || $el.hasClass('note') || $el.hasClass('footer')) {
            return;
        }
        problemDescription.push($.html(element));
    });

    const inputSectionElem = statement.find('.input-specification').clone();
    inputSectionElem.find('.section-title').remove();
    const inputSection = inputSectionElem.html() || '';

    const outputSectionElem = statement.find('.output-specification').clone();
    outputSectionElem.find('.section-title').remove();
    const outputSection = outputSectionElem.html() || '';

    const noteSectionElem = statement.find('.note').clone();
    noteSectionElem.find('.section-title').remove();
    const noteSection = noteSectionElem.html() || '';

    const samples = [];
    statement.find('.sample-tests .sample-test').each((index, sampleEl) => {
        const sample = $(sampleEl);
        const input = sample.find('.input pre').text().replace(/\s+$/, '');
        const output = sample.find('.output pre').text().replace(/\s+$/, '');
        const explanation = sample.find('.sample-comment').html();
        samples.push({
            index: index + 1,
            input,
            output,
            explanation: explanation ? htmlFragmentToMarkdown(explanation) : '',
        });
    });

    const tutorialLink = statement.find('a').filter((_, el) => $(el).text().toLowerCase().includes('tutorial')).first().attr('href');
    let tutorialMarkdown = '';
    if (tutorialLink) {
        const tutorialPath = tutorialLink.startsWith('http') ? tutorialLink : tutorialLink.startsWith('/') ? tutorialLink : `/contest/${contestId}/${tutorialLink}`;
        const tutorialHtml = await fetchPage(tutorialPath, { kind: 'tutorial', index: problemIndex });
        const tutorial$ = cheerio.load(tutorialHtml);
        const typography = tutorial$('.ttypography');
        tutorialMarkdown = typography.length ? htmlFragmentToMarkdown(tutorial$.html(typography)) : htmlFragmentToMarkdown(tutorialHtml);
    }

    return {
        index: problemIndex,
        title: problemName,
        rawTitle: titleText,
        timeLimit,
        memoryLimit,
        inputFile,
        outputFile,
        statementMarkdown: htmlFragmentToMarkdown(problemDescription.join('')),
        inputMarkdown: htmlFragmentToMarkdown(inputSection),
        outputMarkdown: htmlFragmentToMarkdown(outputSection),
        noteMarkdown: htmlFragmentToMarkdown(noteSection),
        samples,
        tutorialMarkdown,
    };
}

module.exports = getProblemDetails;

