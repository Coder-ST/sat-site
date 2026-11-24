import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import { SessionCards, SessionPreview, SessionQuiz } from './pages/Session';
import QuizPage from './pages/QuizPage';
import { DeckViewer } from './pages/Flashcards';
import Study from './pages/Study';
import Affixes from './pages/Affixes';
import WordList from './pages/WordList';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="session" element={<SessionPreview />} />
        <Route path="session/cards" element={<SessionCards />} />
        <Route path="session/quiz" element={<SessionQuiz />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="study" element={<Study />} />
        <Route path="review" element={<Navigate to="/session" replace />} />
        <Route path="cards" element={<Navigate to="/study" replace />} />
        <Route path="practice" element={<Navigate to="/study" replace />} />
        <Route path="cards/:deck" element={<DeckViewer />} />
        <Route path="affixes" element={<Affixes />} />
        <Route path="words" element={<WordList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
