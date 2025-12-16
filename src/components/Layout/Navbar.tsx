import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';

export const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by Order ID and Patient Name"
            className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Right side - User info */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="p-2">
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>

        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">W</span>
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-900">walkwelaffiliatel23</div>
            <div className="text-gray-600">Affiliate Admin</div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </div>

        <Button variant="ghost" size="sm" onClick={handleLogout} className="p-2 ml-2">
          <LogOut className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </header>
  );
};