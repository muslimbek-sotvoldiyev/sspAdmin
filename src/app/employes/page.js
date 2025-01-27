'use client';
import React, { useState } from 'react';
import { useGetEmployeesQuery, useAddEmployeeMutation } from '@/lib/service/api';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import EmployeeModal from '@/components/AddEmployesModal';
import Pagination from '@/components/pagination';

const EmployeesList = () => {
  const [page, setPage] = useState(1);
  const [page_size, setPage_size] = useState(5);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    role: 'director',
    phone_number: '',
    region: '',
    district: '',
    password: '',
    passport: '',
  });

  const regions = [
    'Toshkent',
    'Andijon',
    'Buxoro',
    'Fargona',
    'Jizzax',
    'Namangan',
    'Navoiy',
    'Qashqadaryo',
    'Qoraqalpogiston',
    'Samarqand',
    'Sirdaryo',
    'Surxondaryo',
    'ToshkentViloyati',
    'Xorazm',
  ];
  const districts = {
    Toshkent: [
      'Bektemir',
      "Mirzo-Ulug'bek",
      'Sergeli',
      'Uchtepa',
      'Chilonzor',
      'Shayxontohur',
      'Yakkasaroy',
      'Yashnobod',
      'Yunusobod',
    ],
    Andijon: [
      'Andijon shahri',
      'Andijon tumani',
      'Asaka',
      'Baliqchi',
      "Bo'z",
      'Buloqboshi',
      'Jalaquduq',
      "Xo'jaobod",
      'Izboskan',
      'Marhamat',
      "Oltinko'l",
      'Paxtaobod',
      "Qo'rg'ontepa",
      'Shahrixon',
      "Ulug'nor",
      'Xonobod',
    ],
    Buxoro: [
      'Buxoro shahri',
      'Buxoro tumani',
      "G'ijduvon",
      'Jondor',
      'Kogon',
      'Kogon shahri',
      'Olot',
      'Peshku',
      "Qorako'l",
      'Qorovulbozor',
      'Romitan',
      'Shofirkon',
      'Vobkent',
    ],
    Fargona: [
      "Farg'ona shahri",
      'Beshariq',
      "Bog'dod",
      'Buvayda',
      "Dang'ara",
      "Farg'ona tumani",
      'Furqat',
      "Qo'qon",
      'Oltiariq',
      'Quva',
      'Rishton',
      "So'x",
      'Toshloq',
      "Uchko'prik",
      "O'zbekiston",
      'Yozyovon',
    ],
    Jizzax: [
      'Jizzax shahri',
      'Arnasoy',
      'Baxmal',
      "Do'stlik",
      'Forish',
      "G'allaorol",
      'Sharof Rashidov',
      "Mirzacho'l",
      'Paxtakor',
      'Yangiobod',
      'Zarbdor',
      'Zafarobod',
      'Zomin',
    ],
    Namangan: [
      'Namangan shahri',
      'Chortoq',
      'Chust',
      'Kosonsoy',
      'Mingbuloq',
      'Namangan tumani',
      'Norin',
      'Pop',
      "To'raqo'rg'on",
      "Uchqo'rg'on",
      'Uychi',
      "Yangiqo'rg'on",
    ],
    Navoiy: [
      'Navoiy shahri',
      'Karmana',
      'Konimex',
      'Navbahor',
      'Nurota',
      'Qiziltepa',
      'Tomdi',
      'Uchquduq',
      'Xatirchi',
      'Zarafshon',
    ],
    Qashqadaryo: [
      'Qarshi shahri',
      'Chiroqchi',
      'Dehqonobod',
      "G'uzor",
      'Qamashi',
      'Qarshi tumani',
      'Kasbi',
      'Kitob',
      'Koson',
      'Mirishkor',
      'Muborak',
      'Nishon',
      'Shahrisabz',
      "Yakkabog'",
    ],
    Qoraqalpogiston: [
      'Nukus shahri',
      'Amudaryo',
      'Beruniy',
      'Chimboy',
      "Ellikqal'a",
      'Kegeyli',
      "Mo'ynoq",
      'Nukus tumani',
      "Qonliko'l",
      "Qo'ng'irot",
      "Qorao'zak",
      'Shumanay',
      "Taxtako'pir",
      "To'rtko'l",
      "Xo'jayli",
    ],
    Samarqand: [
      'Samarqand shahri',
      "Bulung'ur",
      'Ishtixon',
      'Jomboy',
      "Kattaqo'rg'on",
      "Kattaqo'rg'on shahri",
      'Narpay',
      'Nurobod',
      'Oqdaryo',
      'Paxtachi',
      'Payariq',
      "Pastdarg'om",
      "Qo'shrabot",
      'Samarqand tumani',
      'Toyloq',
      'Urgut',
    ],
    Sirdaryo: [
      'Guliston shahri',
      'Boyovut',
      'Guliston tumani',
      'Mirzaobod',
      'Oqoltin',
      'Sardoba',
      'Sayxunobod',
      'Sirdaryo tumani',
      'Xovos',
      'Yangiyer',
      'Shirin',
    ],
    Surxondaryo: [
      'Termiz shahri',
      'Angor',
      'Bandixon',
      'Boysun',
      'Denov',
      "Jarqo'rg'on",
      'Qiziriq',
      "Qumqo'rg'on",
      'Muzrabot',
      'Oltinsoy',
      'Sariosiyo',
      'Sherobod',
      "Sho'rchi",
      'Termiz tumani',
      'Uzun',
    ],
    ToshkentViloyati: [
      'Angren',
      'Bekobod',
      'Bekobod tumani',
      "Bo'ka",
      "Bo'stonliq",
      'Chinoz',
      'Chirchiq',
      'Ohangaron',
      "Oqqo'rg'on",
      'Parkent',
      'Piskent',
      'Quyichirchiq',
      "O'rta Chirchiq",
      'Toshkent tumani',
      'Yangiobod',
      "Yangiyo'l",
      'Yuqorichirchiq',
      'Zangiota',
    ],
    Xorazm: [
      'Urganch shahri',
      "Bog'ot",
      'Gurlan',
      'Xiva',
      'Hazorasp',
      "Qo'shko'pir",
      'Shovot',
      'Urganch tumani',
      'Xonqa',
      'Yangiariq',
      'Yangibozor',
    ],
  };

  const { data, error, isLoading } = useGetEmployeesQuery({
    page,
    page_size,
  });

  const [addEmployee, { isLoading: isAdding }] = useAddEmployeeMutation();

  const router = useRouter();

  const handleEmployeeClick = (id) => {
    router.push(`/employes/${id}`);
  };

  const handleAddEmployee = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPage_size(newPageSize);
    setPage(1);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addEmployee(newEmployee).unwrap();
      handleCloseModal();
      setNewEmployee({
        first_name: '',
        last_name: '',
        role: 'director',
        phone_number: '',
        region: '',
        district: '',
        password: '',
        passport: '',
      });
      alert('Employee added successfully!');
    } catch (error) {
      console.error('Failed to add employee:', error);
      alert('Failed to add employee. Please try again.');
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  const totalPages = Math.ceil(data.count / page_size);

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Employees List</h1>

        <button
          onClick={handleAddEmployee}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative overflow-hidden px-6 py-3 bg-indigo-500 text-white rounded-lg transform transition-all duration-300 hover:shadow-xl flex items-center gap-2"
        >
          <Plus
            size={20}
            className={`transform transition-all duration-300 ${isHovered ? 'rotate-180' : ''}`}
          />
          <span className="font-semibold">Add Employee</span>
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
      </div>

      <ul className="space-y-5">
        {data.results.map((employee) => (
          <li
            key={employee.id}
            className="flex items-center gap-5 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            onClick={() => handleEmployeeClick(employee.id)}
          >
            <img
              src={employee.image}
              alt={`${employee.first_name} ${employee.last_name}`}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <p>
                <strong>Name:</strong> {employee.first_name} {employee.last_name}
              </p>
              <p>
                <strong>Phone:</strong> {employee.phone_number}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={page_size}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        newEmployee={newEmployee}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        regions={regions}
        districts={districts}
      />
    </div>
  );
};

export default EmployeesList;
