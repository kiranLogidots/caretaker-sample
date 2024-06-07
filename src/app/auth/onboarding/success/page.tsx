import { FaCheckCircle } from 'react-icons/fa';

export default function SuccessPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent">
      <div className="flex items-center" style={{ top: '40%' }}>
        <FaCheckCircle className="text-6xl text-green-500 mr-4" />
        <p className="text-3xl font-semibold">Account Created Successfully!</p>
      </div>
    </div>
  );
}
