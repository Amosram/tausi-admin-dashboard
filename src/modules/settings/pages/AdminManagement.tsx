import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AdminUser, User, addNewAdmin, getAllAdmins, getNonAdminUsers, makeUserAdmin, removeAdmin } from '@/app/firebase/adminService';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/redux/hooks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FaTrash, FaUserPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define validation schema for new admin form
const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phoneNumber: yup.string().matches(/^\+?[0-9]{10,15}$/, 'Enter a valid phone number').required('Phone number is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const AdminManagement = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [nonAdminUsers, setNonAdminUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const currentUser = useAppSelector((state) => state.user.user);

  // Fetch all admins on component mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const adminsList = await getAllAdmins();
        setAdmins(adminsList);
      } catch (error) {
        console.error('Error fetching admins:', error);
        toast({
          title: 'Error',
          description: 'Failed to load admin users',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [toast]);

  // Fetch non-admin users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getNonAdminUsers(searchTerm);
        setNonAdminUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Debounce search to avoid too many queries
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      fetchUsers();
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm]);

  // Form for adding new admin
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        
        if (!currentUser || !currentUser.id) {
          toast({
            title: 'Error',
            description: 'You must be logged in to add admins',
            variant: 'destructive',
          });
          return;
        }

        const result = await addNewAdmin(
          values.name,
          values.email,
          values.phoneNumber,
          values.password,
          currentUser.id
        );

        if (result.success) {
          toast({
            title: 'Success',
            description: 'Admin added successfully',
            variant: 'success',
          });
          
          // Refresh admin list
          const adminsList = await getAllAdmins();
          setAdmins(adminsList);
          
          // Reset form and close dialog
          formik.resetForm();
          setDialogOpen(false);
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to add admin',
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'An unexpected error occurred',
          variant: 'destructive',
        });
        console.error('Error adding admin:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  // Handle making an existing user an admin
  const handleMakeAdmin = async () => {
    if (!selectedUser) {
      toast({
        title: 'Error',
        description: 'Please select a user',
        variant: 'destructive',
      });
      return;
    }

    if (!currentUser || !currentUser.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add admins',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const result = await makeUserAdmin(
        selectedUser.id,
        selectedUser.name,
        selectedUser.email,
        selectedUser.phoneNumber,
        currentUser.id
      );

      if (result.success) {
        toast({
          title: 'Success',
          description: 'User was successfully made an admin',
          variant: 'success',
        });
        
        // Refresh admin list
        const adminsList = await getAllAdmins();
        setAdmins(adminsList);
        
        // Refresh non-admin users list
        const users = await getNonAdminUsers(searchTerm);
        setNonAdminUsers(users);
        
        // Reset selection
        setSelectedUser(null);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to make user an admin',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      console.error('Error making user admin:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle admin removal
  const handleRemoveAdmin = async (adminId: string) => {
    if (confirm('Are you sure you want to remove this admin?')) {
      try {
        setLoading(true);
        const success = await removeAdmin(adminId);
        
        if (success) {
          // Update the admins list
          setAdmins(admins.filter(admin => admin.id !== adminId));
          
          toast({
            title: 'Success',
            description: 'Admin removed successfully',
            variant: 'success',
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to remove admin',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error removing admin:', error);
        toast({
          title: 'Error',
          description: 'An error occurred while removing the admin',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Management</h1>
      
      <Tabs defaultValue="admins">
        <TabsList className="mb-4">
          <TabsTrigger value="admins">Admin Users</TabsTrigger>
          <TabsTrigger value="add-new">Add New Admin</TabsTrigger>
          <TabsTrigger value="existing-users">Assign Existing Users</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>
                Manage users who have admin access to the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <p>Loading admins...</p>
                </div>
              ) : admins.length === 0 ? (
                <div className="text-center p-8">
                  <p>No admin users found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Added On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.phoneNumber}</TableCell>
                        <TableCell>{format(admin.createdAt, 'PPP')}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveAdmin(admin.id)}
                            disabled={admin.id === currentUser?.id}
                            title={admin.id === currentUser?.id ? "You cannot remove yourself" : "Remove admin"}
                          >
                            <FaTrash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add-new">
          <Card>
            <CardHeader>
              <CardTitle>Add New Admin</CardTitle>
              <CardDescription>
                Create a new user with admin privileges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Full Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm">{formik.errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <p className="text-red-500 text-sm">{formik.errors.phoneNumber}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm">{formik.errors.password}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading || !formik.isValid}
                  className="w-full"
                >
                  {loading ? 'Adding...' : 'Add Admin'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="existing-users">
          <Card>
            <CardHeader>
              <CardTitle>Assign Admin Role to Existing User</CardTitle>
              <CardDescription>
                Give admin privileges to an existing user in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select User</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedUser ? selectedUser.name : "Select a user..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Search user..." 
                          value={searchTerm}
                          onValueChange={setSearchTerm}
                        />
                        <CommandList>
                          <CommandEmpty>No users found.</CommandEmpty>
                          <CommandGroup>
                            {nonAdminUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.id}
                                onSelect={() => {
                                  setSelectedUser(user);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <span className="font-medium">{user.name}</span>
                                <span className="ml-2 text-sm text-gray-500">{user.email}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {selectedUser && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-semibold mb-2">Selected User Details</h3>
                    <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedUser.phoneNumber || "Not provided"}</p>
                  </div>
                )}
                
                <Button 
                  onClick={handleMakeAdmin}
                  disabled={loading || !selectedUser}
                  className="w-full"
                >
                  <FaUserPlus className="mr-2" />
                  {loading ? 'Processing...' : 'Make Admin'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Admin Permissions</CardTitle>
              <CardDescription>
                Configure permissions and access levels for admin users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Currently, all admins have full access to the dashboard. Role-based permissions will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminManagement; 