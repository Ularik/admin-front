'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { roleDashboardPaths } from '@/constants/main';
import type { UserRole } from '@/types/user';
import { useUser } from '@/services/queries/users';

type Props = {
    children: ReactNode;
    roles: UserRole[];
};

const ProtectedLayout = ({ children, roles }: Props) => {
    const router = useRouter();

    const { data: user, isLoading } = useUser();

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.replace('/register');
            return;
        }

        if (user.status === "ADMIN") {
           roleDashboardPaths[user.status];
           return;
        }

        if (user.status === "HEAD") {
            roleDashboardPaths[user.status];
            return;
        } {
          router.replace(roleDashboardPaths[user.status]);
        }
    }, [isLoading, router, user]);

    if (isLoading || !user) {
        return null;
    }

    if (!roles.includes(user.status)) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedLayout;