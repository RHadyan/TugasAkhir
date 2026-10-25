'use client';

import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useDropzone, FileRejection } from 'react-dropzone';
import Swal from 'sweetalert2';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VCCBE_ADMIN_API_URL } from '@/lib/vccbe-config';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Country {
  id: string;
  name: string;
  flagImage: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    programs: number;
  };
  translations?: {
    id: { name: string };
    en: { name: string | null };
  };
}

const API_BASE = VCCBE_ADMIN_API_URL;

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nameId: '', nameEn: '' });
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [flagImageFile, setFlagImageFile] = useState<File | null>(null);
  const [flagImagePreview, setFlagImagePreview] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, [currentPage, searchQuery]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchQuery && { search: searchQuery }),
      });
      const response = await fetch(`${API_BASE}/countries?${params}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      if (data.success) {
        setCountries(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      alert('Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (country?: Country) => {
    setEditingCountry(country || null);
    setFormData({
      nameId: country?.translations?.id.name || country?.name || '',
      nameEn: country?.translations?.en.name || '',
    });
    setFlagImagePreview(country?.flagImage || '');
    setFlagImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ nameId: '', nameEn: '' });
    setEditingCountry(null);
    setFlagImagePreview('');
    setFlagImageFile(null);
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    // Handle rejected files
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];

      // Check for invalid file type
      if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid File Type',
          text: 'Please upload an image file.',
          timer: 1500,
          showConfirmButton: false
        });
        return;
      }

      if (rejection.file.size > 1 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'File too large',
          text: 'File size exceeds 1MB limit.',
          timer: 1500,
          showConfirmButton: false
        });
        return;
      }
    }

    const file = acceptedFiles[0];
    if (file) {
      setFlagImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFlagImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxSize: 1 * 1024 * 1024, // 1MB
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!editingCountry && !flagImageFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Image',
        text: 'Please select a flag image',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    try {
      setUploading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('nameId', formData.nameId);
      formDataToSend.append('nameEn', formData.nameEn);
      if (flagImageFile) {
        formDataToSend.append('flagImage', flagImageFile);
      }

      const response = await fetch(
        editingCountry
          ? `${API_BASE}/countries/${editingCountry.id}`
          : `${API_BASE}/countries`,
        {
        method: editingCountry ? 'PUT' : 'POST',
        body: formDataToSend,
        // Don't set Content-Type header, browser will set it automatically
      });

      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data.message || 'Country saved successfully',
          timer: 2000,
          showConfirmButton: false
        });
        handleCloseModal();
        fetchCountries();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'Failed to save country',
        });
      }
    } catch (error) {
      console.error('Error saving country:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save country',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (country: Country) => {
    const result = await Swal.fire({
      title: 'Anda yakin hapus Negara?',
      html: `Pastikan semua program yang berkaitan dengan negara ini sudah dihapus! Kamu tidak akan bisa menghapus negara jika masih ada program yang berkaitan! <br><br>Ketik <b>${country.name}</b> untuk mengonfirmasi.`,
      icon: 'warning',
      input: 'text',
      inputPlaceholder: country.name,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus Negara!',
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        const input = Swal.getInput();

        if (confirmBtn && input) {
          confirmBtn.disabled = true;

          input.addEventListener('input', (e) => {
            if ((e.target as HTMLInputElement).value === country.name) {
              confirmBtn.disabled = false;
            } else {
              confirmBtn.disabled = true;
            }
          });
        }
      },
      preConfirm: (inputValue) => {
        if (inputValue !== country.name) {
          Swal.showValidationMessage('Nama negara tidak cocok');
          return false;
        }
        return true;
      }
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE}/countries/${country.id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          Swal.fire({
            title: 'Deleted!',
            text: data.message,
            icon: 'success'
          });
          fetchCountries();
        } else {
          Swal.fire({
            title: 'Error!',
            text: data.error || 'Failed to delete country',
            icon: 'error'
          });
        }
      } catch (error) {
        console.error('Error deleting country:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete country',
          icon: 'error'
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">
              Countries Management
            </h1>
            <p className="text-darklink">Manage countries for your programs</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="gap-2">
            <Icon icon="solar:add-circle-linear" className="w-5 h-5" />
            Add Country
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Icon
                icon="solar:magnifer-linear"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-darklink"
              />
              <Input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Countries</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Icon icon="svg-spinners:ring-resize" className="w-10 h-10 text-primary" />
              </div>
            ) : countries.length === 0 ? (
              <div className="text-center py-20 text-darklink">
                <Icon icon="solar:inbox-linear" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No countries found</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Flag</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>English Name</TableHead>
                      <TableHead>Programs</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {countries.map((country) => (
                      <TableRow key={country.id}>
                        <TableCell>
                          <img
                            src={country.flagImage}
                            alt={country.name}
                            className="w-12 h-8 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{country.name}</TableCell>
                        <TableCell className="text-darklink">
                          {country.translations?.en.name || (
                            <span className="text-amber-600">Uses Indonesian fallback</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-lightprimary text-primary">
                            {country._count?.programs || 0} programs
                          </span>
                        </TableCell>
                        <TableCell className="text-darklink">
                          {new Date(country.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleOpenModal(country)}
                              className="h-8 w-8"
                              aria-label={`Edit ${country.name}`}
                            >
                              <Icon icon="solar:pen-linear" className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(country)}
                              className="h-8 w-8 text-error hover:text-error"
                            >
                              <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-darklink">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <Dialog
        modal={false}
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open && !Swal.isVisible()) setIsModalOpen(false);
        }}
      >
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>
              {editingCountry ? 'Edit Country' : 'Add New Country'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nameId">Nama Indonesia *</Label>
              <Input
                id="nameId"
                value={formData.nameId}
                maxLength={52}
                onChange={(e) => setFormData({ ...formData, nameId: e.target.value })}
                placeholder="contoh: Jepang"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEn">English Name</Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                maxLength={52}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="e.g., Japan (optional)"
              />
              <p className="text-xs text-muted-foreground">
                Empty values use the Indonesian name on the English website.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flagImage">
                Flag Image {editingCountry ? '(leave unchanged if empty)' : '*'}
              </Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors ${isDragActive ? 'bg-gray-100 border-primary' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Icon icon="solar:upload-linear" className="w-10 h-10 text-gray-400" />
                  {isDragActive ? (
                    <p className="text-sm text-gray-500">Drop the files here ...</p>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-700"><span className='text-green-500'>Click to upload</span> or drag and drop file here</p>
                      <p className="text-xs text-gray-500">Maximum file size 1MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {flagImagePreview && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border border-defaultBorder rounded-lg p-4 flex justify-center bg-gray-50">
                  <img
                    src={flagImagePreview}
                    alt="Preview"
                    className="max-h-48 object-contain rounded shadow-sm"
                  />
                </div>
                <div className='flex justify-end'>
                  <Button type='button' variant='ghost' size='sm' className='text-red-500 hover:text-red-700' onClick={() => {
                    setFlagImageFile(null);
                    setFlagImagePreview('');
                  }}>Remove Image</Button>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={handleCloseModal} disabled={uploading}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Icon icon="svg-spinners:ring-resize" className="w-4 h-4 mr-2" />
                    Uploading...
                  </>
                ) : (
                  editingCountry ? 'Update' : 'Create'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
