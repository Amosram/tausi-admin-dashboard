import { TausiUser } from "@/models/user";
import { useMemo } from "react";

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  recentlyRegisteredUsers: number;
  percentageVerified: number;
  userTypeDistribution: {
    clients: number;
    professionals: number;
  };
  professionalMetrics?: {
    totalProfessionals: number;
    verifiedProfessionals: number;
    topRatedProfessionals: number;
    averageRegistrationProgress: number;
    activeProfessionals: number;
    inactiveProfessionals: number;
    businessTypeDistribution: Record<string, number>;
    professionalsWithSpecializations: number;
    averageProfessionalRating: number;
    professionalsWithoutBio: number;
  };
  clientMetrics?: {
    totalClients: number;
    clientsWithoutBio: number;
    clientsWithoutVerifiedContact: number;
    averageClientRegistrationTime: number;
    clientsUsingFCMTokens: number;
    recentlyActiveClients: number;
  };
}

export const useUserMetrics = (users: TausiUser[] | undefined): UserMetrics => {
  return useMemo(() => {
    if (!users || users.length === 0) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        verifiedUsers: 0,
        unverifiedUsers: 0,
        recentlyRegisteredUsers: 0,
        percentageVerified: 0,
        userTypeDistribution: { clients: 0, professionals: 0 },
      };
    }

    // Helper functions
    const isClient = (user: TausiUser) => !user.professional;
    const isProfessional = (user: TausiUser) => !!user.professional;

    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;

    const verifiedUsers = users.filter(
      (user) => user.emailVerified || user.phoneVerified
    ).length;
    const unverifiedUsers = totalUsers - verifiedUsers;

    const recentlyRegisteredUsers = users.filter((user) => {
      const daysSinceRegistration =
        (new Date().getTime() - new Date(user.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);
      return daysSinceRegistration <= 30;
    }).length;

    const percentageVerified = (verifiedUsers / totalUsers) * 100;

    const userTypeDistribution = {
      clients: users.filter(isClient).length,
      professionals: users.filter(isProfessional).length,
    };

    // Professional-specific metrics
    const professionalUsers = users.filter(isProfessional);
    const professionalMetrics = professionalUsers.length
      ? {
        totalProfessionals: professionalUsers.length,
        verifiedProfessionals: professionalUsers.filter(
          (user) => user.professional?.isVerified
        ).length,
        topRatedProfessionals: professionalUsers.filter(
          (user) => user.professional?.topRated
        ).length,
        averageRegistrationProgress:
            professionalUsers.reduce(
              (sum, user) =>
                sum + (user.professional?.registrationProgress || 0),
              0
            ) / professionalUsers.length,
        activeProfessionals: professionalUsers.filter(
          (user) => user.professional?.isActive
        ).length,
        inactiveProfessionals:
            professionalUsers.length -
            professionalUsers.filter((user) => user.professional?.isActive)
              .length,
        businessTypeDistribution: professionalUsers.reduce((acc, user) => {
          const businessType = user.professional?.businessType || "unknown";
          acc[businessType] = (acc[businessType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        professionalsWithSpecializations: professionalUsers.filter(
          (user) => !!user.professional?.specialization
        ).length,
        averageProfessionalRating:
            professionalUsers.reduce(
              (sum, user) => sum + (user.professional?.rating || 0),
              0
            ) / professionalUsers.length,
        professionalsWithoutBio: professionalUsers.filter(
          (user) => !user.bio
        ).length,
      }
      : undefined;

    // Client-specific metrics
    const clientUsers = users.filter(isClient);
    const clientMetrics = clientUsers.length
      ? {
        totalClients: clientUsers.length,
        clientsWithoutBio: clientUsers.filter((user) => !user.bio).length,
        clientsWithoutVerifiedContact: clientUsers.filter(
          (user) => !user.emailVerified && !user.phoneVerified
        ).length,
        averageClientRegistrationTime:
            clientUsers.reduce((sum, user) => {
              const createdAt = new Date(user.createdAt).getTime();
              const updatedAt = new Date(user.updatedAt).getTime();
              return sum + (updatedAt - createdAt);
            }, 0) /
            clientUsers.length /
            (1000 * 60 * 60 * 24), // Convert milliseconds to days
        clientsUsingFCMTokens: clientUsers.filter(
          (user) => !!user.fcmToken
        ).length,
        recentlyActiveClients: clientUsers.filter((user) => {
          const daysSinceUpdate =
              (new Date().getTime() - new Date(user.updatedAt).getTime()) /
              (1000 * 60 * 60 * 24);
          return daysSinceUpdate <= 30;
        }).length,
      }
      : undefined;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      verifiedUsers,
      unverifiedUsers,
      recentlyRegisteredUsers,
      percentageVerified,
      userTypeDistribution,
      professionalMetrics,
      clientMetrics,
    };
  }, [users]);
};
