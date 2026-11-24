# SAT Vocab Trainer

React + Vite app. Progress is saved in `localStorage` (key `satvocab_v1`, unchanged from the original single-file version).

```
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Structure

```
src/
  data/vocab.json        word lists (hf, cm, roots, prefixes, suffixes)
  lib/                   pure logic: decks, spaced repetition, reducer, text helpers
  hooks/                 progress context + study timer, keyboard hook
  components/
    ui/                  Button, Icon, ProgressBar/Ring, Stepper, PageHeader
    layout/              AppLayout, Sidebar, TopBar
    flashcards/          FlashcardViewer
    quiz/                QuizRunner, QuizResults
  pages/                 Home, Session, QuizPage, Review, Flashcards, Practice, Affixes, WordList
  styles/                tokens (colors/type/spacing, dark mode), base, ui, layout
legacy/index.html        the original single-file version
```
**Live site:** https://coder-st.github.io/sat-site/
