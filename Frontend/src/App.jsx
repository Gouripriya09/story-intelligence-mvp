import { useCallback, useMemo, useState } from 'react';
import { analyzeStoryFile } from './api/storyApi';
import { buildEmotionalIntensityData } from './utils/storyParser';
import Header from './components/Header';
import HowItWorksModal from './components/HowItWorksModal';
import UploadSection from './components/UploadSection';
import KpiCards from './components/KpiCards';
import ChartsSection from './components/ChartsSection';
import RewriteImpactAnalyzer from './components/RewriteImpactAnalyzer';

function App() {
  const [file, setFile] = useState(null);
  const [storyText, setStoryText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const hasResults = Boolean(analysis && !analysis.error);

  const emotionalData = useMemo(
    () => (storyText ? buildEmotionalIntensityData(storyText) : []),
    [storyText],
  );

  const characterData = useMemo(() => {
    if (!analysis?.characters?.length) return [];
    return analysis.characters.map((c) => ({
      name: c.name,
      frequency: c.frequency ?? 0,
    }));
  }, [analysis]);

  const handleFileChange = useCallback(async (selected) => {
    setFile(selected);
    setError('');
    setAnalysis(null);

    if (!selected) {
      setStoryText('');
      return;
    }

    try {
      const text = await selected.text();
      setStoryText(text);
    } catch {
      setStoryText('');
      setError('Could not read the selected file.');
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);

    try {
      const text = storyText || (await file.text());
      setStoryText(text);

      const data = await analyzeStoryFile(file);

      if (data.error) {
        setError(data.details || data.error || 'Analysis failed. Please try again.');
        setAnalysis(data);
        return;
      }

      setAnalysis(data);
    } catch (err) {
      const message =
        err.response?.data?.details ||
        err.response?.data?.error ||
        err.message ||
        'Unable to reach the analysis API. Is the backend running on port 8000?';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [file, storyText]);

  return (
    <div className="min-h-screen bg-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-100/40 blur-3xl" />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-violet-100/30 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="space-y-10 lg:space-y-14">
          <Header onHowItWorks={() => setHowItWorksOpen(true)} />

          <UploadSection
            file={file}
            onFileChange={handleFileChange}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            error={error}
          />

          <KpiCards analysis={analysis} hasResults={hasResults} />

          <ChartsSection
            emotionalData={emotionalData}
            characterData={characterData}
            hasResults={hasResults}
          />

          <RewriteImpactAnalyzer
            storyText={storyText}
            characters={analysis?.characters}
            hasResults={hasResults}
          />
        </div>
      </main>

      <HowItWorksModal open={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />
    </div>
  );
}

export default App;
