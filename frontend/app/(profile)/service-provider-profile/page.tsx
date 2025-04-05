import AuthGuard from "@/components/auth/AuthGuard";
import React from "react";

const ServiceProviderProfile = () => {
  return (
    <AuthGuard>
      <div>Service Provider Profile</div>
    </AuthGuard>
  );
};

export default ServiceProviderProfile;
