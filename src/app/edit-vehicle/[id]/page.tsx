'use client';

import { useParams } from 'next/navigation';
import EditVehicleView from '@/modules/admin/views/EditVehicleView';

export default function EditVehiclePage() {
  const params = useParams();
  const id = params.id as string;

  if (!id) return <p>Loading...</p>;

  return <EditVehicleView id={id} />;
}