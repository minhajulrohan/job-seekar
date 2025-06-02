
// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { User, LogOut, Settings, Briefcase } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

// export const UserMenu: React.FC = () => {
//   const { user, logout } = useAuth();

//   if (!user) return null;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" className="flex items-center space-x-2">
//           <User className="h-4 w-4" />
//           <span>{user.name}</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-56">
//         <div className="flex items-center space-x-2 p-2">
//           <User className="h-4 w-4" />
//           <div className="flex flex-col space-y-1">
//             <p className="text-sm font-medium">{user.name}</p>
//             <p className="text-xs text-gray-500">{user.email}</p>
//           </div>
//         </div>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>
//           <Briefcase className="h-4 w-4 mr-2" />
//           My Applications
//         </DropdownMenuItem>
//         <DropdownMenuItem>
//           <Settings className="h-4 w-4 mr-2" />
//           Settings
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={logout}>
//           <LogOut className="h-4 w-4 mr-2" />
//           Sign Out
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };
