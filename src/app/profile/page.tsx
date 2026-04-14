import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getProfileUser, getProfileStats } from '@/lib/db/users';
import { getItemTypeIcon } from '@/lib/item-type-icons';
import { UserAvatar } from '@/components/auth/UserAvatar';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { DeleteAccountSection } from '@/components/profile/DeleteAccountSection';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const [user, stats] = await Promise.all([
    getProfileUser(session.user.id),
    getProfileStats(session.user.id),
  ]);

  if (!user) redirect('/sign-in');

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account</p>
      </div>

      {/* User Info */}
      <section className="flex items-center gap-5">
        <UserAvatar name={user.name} image={user.image} size="lg" />
        <div className="space-y-0.5">
          <p className="text-lg font-semibold">{user.name ?? 'No name set'}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Usage
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold tabular-nums">{stats.totalItems}</p>
            <p className="text-sm text-muted-foreground">Total items</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold tabular-nums">{stats.totalCollections}</p>
            <p className="text-sm text-muted-foreground">Total collections</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card divide-y divide-border">
          {stats.itemTypeBreakdown.map((type) => {
            const Icon = getItemTypeIcon(type.icon);
            return (
              <div key={type.name} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" style={{ color: type.color ?? undefined }} />
                  <span className="text-sm">{type.name}</span>
                </div>
                <span className="text-sm font-medium tabular-nums">{type.count}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Account Actions */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Account
        </h2>
        {user.hasPassword && <ChangePasswordForm />}
        <DeleteAccountSection email={user.email} />
      </section>
    </div>
  );
}
