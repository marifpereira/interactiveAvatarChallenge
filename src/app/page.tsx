import InteractiveAvatar from '../components/InteractiveAvatar';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, rgb(234 150 215) 0%, rgb(130 167 255) 100%)',
    }}>
      <InteractiveAvatar />
    </div>
  );
}