import logo from '../assets/images/logo.jfif';

export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="text-center">
        <img
          src={logo}
          className="w-24 h-24 rounded-full animate-pulse mx-auto mb-4"
        />
        <p className="text-lg font-semibold text-gray-600">
          Chargement...
        </p>
      </div>
    </div>
  );
}