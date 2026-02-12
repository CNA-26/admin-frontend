import AdminLayout from "../layout/AdminLayout";
import ShowUsers from "../components/users/ShowUsers";

const AdminUsers = () => {
  return (
    <AdminLayout>
      <div className="grid grid-cols-3 gap-6 ">
        <div className="col-span-3">
          <ShowUsers />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;