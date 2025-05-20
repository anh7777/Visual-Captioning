replace_dict = {
    ' .': '.',
    ' ,': ',',
    ' ;': ';',
    ' :': ':',
    '( ': '(',
    ' )': ')',
    " '": "'"
}


def get_recipe(ids, vocab):
    return [vocab[id_] for id_ in ids]


def get_ingrs(ids, ingr_vocab_list):
    return [ingr_vocab_list[idx] for idx in ids if ingr_vocab_list[idx] != '<pad>']


def prettify(toks, replace_dict):
    text = ' '.join(toks).split('<end>')[0]
    sentences = text.split('<eoi>')
    pretty_sentences = []
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        sentence = sentence.capitalize()
        for key, value in replace_dict.items():
            sentence = sentence.replace(key, value)
        pretty_sentences.append(sentence)
    return pretty_sentences


def colorized_list(ingrs, ingrs_gt, colorize=False):
    if not colorize:
        return ingrs
    return [
        f'\033[1;30;42m {word} \x1b[0m' if word in ingrs_gt else f'\033[1;30;41m {word} \x1b[0m'
        for word in ingrs
    ]


def prepare_output(ids, gen_ingrs, ingr_vocab_list, vocab):
    toks = get_recipe(ids, vocab)
    is_valid = True
    reason = 'All ok.'
    try:
        cut = toks.index('<end>')
        toks_trunc = toks[:cut]
    except ValueError:
        toks_trunc = toks
        is_valid = False
        reason = 'no eos found'

    score = len(set(toks_trunc)) / len(toks_trunc) if toks_trunc else 0.0
    found_repeat = any(
        toks_trunc[i] == toks_trunc[i + 1] and toks_trunc[i] != '<eoi>'
        for i in range(len(toks_trunc) - 1)
    )

    toks = prettify(toks, replace_dict)
    title = toks[0] if toks else ''
    recipe = toks[1:] if len(toks) > 1 else []

    if gen_ingrs is not None:
        gen_ingrs = get_ingrs(gen_ingrs, ingr_vocab_list)

    if score <= 0.3:
        is_valid = False
        reason = 'Diversity score.'
    elif len(toks) != len(set(toks)):
        is_valid = False
        reason = 'Repeated instructions.'
    elif found_repeat:
        is_valid = False
        reason = 'Found word repeat.'

    return (
        {'title': title, 'recipe': recipe, 'ingrs': gen_ingrs},
        {'is_valid': is_valid, 'reason': reason, 'score': score}
    )