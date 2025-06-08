# こども漢字辞書

[漢字の書き順(筆順)・読み方・画数・部首・用例・成り立ちを調べるための漢字辞書](https://marmooo.github.io/kanji-dict/)です。
Unicode 16.0 のすべての漢字 98,682字を収録しています。

## Installation

- install [KanjiVG/kanjivg](https://github.com/KanjiVG/kanjivg) licensed under
  the CC-BY-SA-3.0
- install [marmooo/graded-vocab-ja](https://github.com/marmooo/graded-vocab-ja)
  licensed under the CC-BY-4.0
- install
  [marmooo/graded-idioms-ja](https://github.com/marmooo/graded-idioms-ja)
  licensed under the CC-BY-4.0
- install [onkun](https://github.com/marmooo/onkun) licensed under the MIT

## Build

```
bash install-fonts.sh
deno task build-csv
deno task [task-name]
bash build.sh
```

## License

CC-BY-SA-4.0

## Attribution

- [Jigmoフォント](https://github.com/kamichikoichi/jigmo)
- [古代文字フォント「春秋-tsu」](http://www.tarojiro.co.jp/kanji/shunju-tsu/)
