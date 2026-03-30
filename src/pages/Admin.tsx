import { useLocation } from "wouter";
import { format } from "date-fns";
import { Users, Shield, ShieldCheck, Mail, ArrowLeft, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-auth";
import { useAdminUsers, useAdminDeleteUser } from "@/hooks/use-admin";
import { Link } from "wouter";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const deleteUser = useAdminDeleteUser();

  // Protect admin route
  if (!userLoading && (!user || !user.is_admin)) {
    setTimeout(() => setLocation("/"), 0);
    return null;
  }

  return (
    <div className="min-h-screen notebook-page relative">
      <Navbar />

      {/* Book spine shadow on left */}
      <div className="fixed top-0 left-0 bottom-0 w-16 pointer-events-none z-40 hidden lg:block" style={{
        background: 'linear-gradient(to right, rgba(80, 55, 30, 0.06), transparent)',
      }} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-amber-800/40 hover:text-amber-800/70 mb-4 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Feed
            </Link>
            <h1 className="text-4xl font-display font-bold flex items-center gap-3" style={{ color: 'hsl(25, 35%, 15%)' }}>
              <Shield className="w-8 h-8 text-amber-700/60" />
              Admin Dashboard
            </h1>
            <p className="text-amber-800/40 mt-2 text-lg">Manage users and oversee community content.</p>
          </div>
        </div>

        {/* Notice */}
        <div className="leather-card rounded-lg p-4 sm:p-6 mb-8 flex gap-4">
          <div className="shrink-0 pt-1">
            <ShieldCheck className="w-6 h-6 text-amber-800/40" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg mb-1" style={{ color: 'hsl(25, 35%, 20%)' }}>Content Moderation</h3>
            <p className="text-sm text-amber-800/45 leading-relaxed">
              As an admin, you have special privileges on the feed. When browsing posts and comments, 
              you will see an admin delete button (warning icon) that allows you to instantly remove any inappropriate content.
            </p>
          </div>
        </div>

        <div className="leather-card rounded-lg overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-3" style={{ 
            borderBottom: '1px solid rgba(160, 130, 90, 0.2)',
            background: 'rgba(160, 120, 60, 0.04)',
          }}>
            <Users className="w-5 h-5 text-amber-800/35" />
            <h2 className="font-display font-semibold text-lg" style={{ color: 'hsl(25, 35%, 20%)' }}>Registered Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(160, 130, 90, 0.15)' }}>
                  <th className="px-6 py-3 font-medium text-amber-800/40 text-xs tracking-wider uppercase">User</th>
                  <th className="px-6 py-3 font-medium text-amber-800/40 text-xs tracking-wider uppercase">Role</th>
                  <th className="px-6 py-3 font-medium text-amber-800/40 text-xs tracking-wider uppercase hidden sm:table-cell">Joined</th>
                  <th className="px-6 py-3 font-medium text-amber-800/40 text-xs tracking-wider uppercase text-right">ID</th>
                  <th className="px-6 py-3 font-medium text-amber-800/40 text-xs tracking-wider uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-amber-800/35">
                      Loading users...
                    </td>
                  </tr>
                ) : users?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-amber-800/35">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users?.map((u) => (
                    <tr key={u.id} className="hover:bg-amber-800/3 transition-colors" style={{ borderBottom: '1px solid rgba(160, 130, 90, 0.1)' }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{
                            background: 'linear-gradient(135deg, rgba(160, 120, 60, 0.1), rgba(140, 100, 50, 0.18))',
                            border: '1px solid rgba(160, 120, 60, 0.18)',
                          }}>
                            <span className="font-display font-semibold text-amber-800/60 uppercase">{u.username.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm" style={{ color: 'hsl(25, 30%, 22%)' }}>{u.username}</p>
                            <p className="text-xs text-amber-800/30 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${u.is_admin 
                          ? 'bg-amber-700/10 text-amber-800/70 border border-amber-700/15' 
                          : 'bg-amber-800/5 text-amber-800/40 border border-amber-800/8'
                        }`}>
                          {u.is_admin ? 'Admin' : 'Member'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-amber-800/35 hidden sm:table-cell">
                        {u.created_at ? format(new Date(u.created_at), 'MMM d, yyyy') : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-amber-800/20 text-right truncate max-w-[120px]">
                        {u.id.split('-')[0]}...
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (u.id === user?.id) {
                              alert("You cannot delete your own account");
                              return;
                            }
                            if (confirm(`Delete user "${u.username}"? This action is irreversible.`)) {
                              deleteUser.mutate(u.id);
                            }
                          }}
                          disabled={deleteUser.isPending || u.id === user?.id}
                          className="text-red-600/30 hover:text-red-700 hover:bg-red-50 rounded-md h-8 w-8"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
