'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useDropzone, FileRejection } from 'react-dropzone';
import Swal from 'sweetalert2';
import { ArrowLeft, X, Plus } from 'lucide-react';

import DashboardLayout from '@/app/(console)/admin/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { VCCBE_API_URL } from '@/lib/vccbe-config';

const API_BASE = VCCBE_API_URL;

const moveArrayItem = <T,>(items: T[], index: number, direction: -1 | 1) => {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
};

interface GalleryItem {
  _key?: string;
  imageUrl: string;
  title: string;
  shortDescription: string;
  englishTitle?: string;
  englishShortDescription?: string;
  // Temporary for UI state when adding new photos
  imageFile?: File | null;
}

interface GalleryTranslationItem {
  _key?: string;
  title?: string | null;
  shortDescription?: string | null;
}

type UpdateGalleryItem = <K extends keyof GalleryItem>(
  index: number,
  field: K,
  value: GalleryItem[K],
) => void;

interface Program {
  id: string;
  title: string;
  gallery: GalleryItem[];
  translations?: {
    en?: {
      title?: string | null;
      shortDescription?: string | null;
      description?: string | null;
      timelineDescription?: string | null;
      scholarshipDescription?: string | null;
      objectives?: unknown[];
      timeline?: unknown[];
      scholarships?: unknown[];
      customSections?: unknown[];
      gallery?: GalleryTranslationItem[];
    } | null;
  };
  // Other fields exist but we only need these for this page
}

// Sub-component for adding new gallery item in Modal
const GalleryInputRow = ({
  item,
  index,
  language,
  updateItem,
  removeItem
}: {
  item: GalleryItem;
  index: number;
  language: 'id' | 'en';
  updateItem: UpdateGalleryItem;
  removeItem: (index: number) => void;
}) => {
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid File',
        text: 'Please upload a valid image file under 1MB.',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }
    const file = acceptedFiles[0];
    if (file) {
      updateItem(index, 'imageFile', file);
    }
  }, [index, updateItem]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 1 * 1024 * 1024,
    multiple: false
  });

  const previewUrl = item.imageFile
    ? URL.createObjectURL(item.imageFile)
    : item.imageUrl;

  return (
    <div className="pt-10 pb-4 px-4 bg-gray-50 rounded-lg space-y-4 relative border border-gray-100">
      <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">Photo {index + 1}</div>
      {index > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => removeItem(index)}
        >
          <Icon icon="solar:trash-bin-trash-linear" />
        </Button>
      )}

      <div className="space-y-3">
        <div>
          <Label className="text-xs font-semibold text-gray-700">Image *</Label>
          <div
            {...getRootProps()}
            className={`mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition-colors ${isDragActive ? 'bg-gray-200 border-primary' : 'bg-white'}`}
          >
            <input {...getInputProps()} />
            {!previewUrl ? (
              <div className="flex flex-col items-center justify-center space-y-1 py-2">
                <Icon icon="solar:upload-linear" className="w-8 h-8 text-gray-400" />
                <p className="text-xs font-semibold text-gray-700"><span className='text-green-600'>Upload</span> / Drag & Drop</p>
                <p className="text-[10px] text-gray-400">Max 1MB</p>
              </div>
            ) : (
              <div className="relative w-full h-32 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="h-full w-auto object-contain rounded" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 bg-white rounded-full shadow-md text-red-500 h-6 w-6 border hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateItem(index, 'imageFile', null);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label className="text-xs font-semibold text-gray-700">
              {language === 'id' ? 'Title' : 'English Title'}
            </Label>
            <Input
              value={
                language === 'id' ? item.title : item.englishTitle || ''
              }
              onChange={e =>
                updateItem(
                  index,
                  language === 'id' ? 'title' : 'englishTitle',
                  e.target.value,
                )
              }
              placeholder={
                language === 'id'
                  ? 'Photo Title'
                  : item.title || 'Indonesian title reference'
              }
              className="mt-1 h-9 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-gray-700">
              {language === 'id'
                ? 'Short Description'
                : 'English Short Description'}
            </Label>
            <Textarea
              value={
                language === 'id'
                  ? item.shortDescription
                  : item.englishShortDescription || ''
              }
              onChange={e =>
                updateItem(
                  index,
                  language === 'id'
                    ? 'shortDescription'
                    : 'englishShortDescription',
                  e.target.value,
                )
              }
              placeholder={
                language === 'id'
                  ? 'Brief description...'
                  : item.shortDescription ||
                    'Indonesian short description reference'
              }
              rows={2}
              className="mt-1 text-sm resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProgramGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'id' | 'en'>('id');
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(
    null,
  );
  const [isDirty, setIsDirty] = useState(false);
  const [newPhotos, setNewPhotos] = useState<GalleryItem[]>([
    { _key: crypto.randomUUID(), title: '', shortDescription: '', imageUrl: '', imageFile: null }
  ]);
  const [uploading, setUploading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const fetchProgram = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/programs/${id}`);
      const data = await res.json();
      if (data.success) {
        setProgram(data.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'Program not found',
        });
        router.push('/admin/programs');
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch program details',
      });
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProgram();
  }, [fetchProgram]);

  // Gallery Input Handlers
  const addPhotoInput = () => {
    setNewPhotos([...newPhotos, { _key: crypto.randomUUID(), title: '', shortDescription: '', imageUrl: '', imageFile: null }]);
    setIsDirty(true);
  };

  const removePhotoInput = (index: number) => {
    if (newPhotos.length > 1) {
      setNewPhotos(newPhotos.filter((_, i) => i !== index));
      setIsDirty(true);
    }
  };

  const updatePhotoInput: UpdateGalleryItem = (index, field, value) => {
    setNewPhotos((current) =>
      current.map((photo, photoIndex) =>
        photoIndex === index ? { ...photo, [field]: value } : photo,
      ),
    );
    setIsDirty(true);
  };

  const handleOpenModal = () => {
    setNewPhotos([{ _key: crypto.randomUUID(), title: '', shortDescription: '', imageUrl: '', imageFile: null }]);
    setActiveLanguage('id');
    setEditingPhotoIndex(null);
    setIsDirty(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (index: number) => {
    if (!program) return;
    const photo = program.gallery[index];
    const englishGallery = program.translations?.en?.gallery || [];
    const englishPhoto =
      englishGallery.find((item) => item._key === photo._key) ||
      englishGallery[index];
    setNewPhotos([
      {
        ...photo,
        englishTitle: englishPhoto?.title || '',
        englishShortDescription: englishPhoto?.shortDescription || '',
        imageFile: null,
      },
    ]);
    setEditingPhotoIndex(index);
    setActiveLanguage('id');
    setIsDirty(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = async () => {
    if (isDirty) {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Discard unsaved changes?',
        text: 'Your gallery changes have not been saved.',
        showCancelButton: true,
        confirmButtonText: 'Discard changes',
        cancelButtonText: 'Continue editing',
        confirmButtonColor: '#dc2626',
      });
      if (!result.isConfirmed) return;
    }
    setIsDirty(false);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!program) return;

    // Validate inputs
    for (const photo of newPhotos) {
      if (!photo.imageFile && !photo.imageUrl) {
        Swal.fire({
          icon: 'warning',
          title: 'Validation Error',
          text: 'Image is required for each photo.',
          timer: 2000
        });
        return;
      }
    }

    try {
      setUploading(true);
      const formData = new FormData();
      const existingGallery = program.gallery || [];
      const newGalleryItemsForJson = newPhotos.map(p => ({
        _key: p._key,
        imageUrl: p.imageUrl || '',
        title: p.title,
        shortDescription: p.shortDescription
      }));

      const finalGallery =
        editingPhotoIndex === null
          ? [...existingGallery, ...newGalleryItemsForJson]
          : existingGallery.map((item, index) =>
              index === editingPhotoIndex
                ? { ...item, ...newGalleryItemsForJson[0] }
                : item,
            );

      formData.append('gallery', JSON.stringify(finalGallery));
      const currentEnglish = program.translations?.en || {};
      const existingEnglishGallery = currentEnglish.gallery || [];
      const newEnglishGallery = newPhotos.map((photo) => ({
        _key: photo._key,
        title: photo.englishTitle || null,
        shortDescription: photo.englishShortDescription || null,
      }));
      formData.append(
        'translations',
        JSON.stringify({
          en: {
            ...currentEnglish,
            gallery:
              editingPhotoIndex === null
                ? [...existingEnglishGallery, ...newEnglishGallery]
                : finalGallery.map((baseItem, index) => {
                    if (index === editingPhotoIndex) {
                      return newEnglishGallery[0];
                    }
                    return (
                      existingEnglishGallery.find(
                        (translatedItem) =>
                          translatedItem._key === baseItem._key,
                      ) ||
                      existingEnglishGallery[index] || {
                        _key: baseItem._key,
                        title: null,
                        shortDescription: null,
                      }
                    );
                  }),
          },
        }),
      );

      newPhotos.forEach((photo, i) => {
        const targetIndex =
          editingPhotoIndex === null
            ? existingGallery.length + i
            : editingPhotoIndex;
        if (photo.imageFile) {
          formData.append(
            photo._key
              ? `gallery_image_${photo._key}`
              : `gallery_image_${targetIndex}`,
            photo.imageFile,
          );
        }
      });

      // Send PUT request
      const res = await fetch(`${API_BASE}/admin/programs/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text:
            editingPhotoIndex === null
              ? 'Photos added successfully.'
              : 'Photo updated successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        setIsModalOpen(false);
        setIsDirty(false);
        fetchProgram(); // Refresh data
      } else {
        throw new Error(data.error || 'Failed to update gallery');
      }

    } catch (error) {
      console.error('Submit error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to upload photos.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (indexToDelete: number) => {
    if (!program) return;

    const result = await Swal.fire({
      title: 'Delete Photo?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        // Construct new gallery array
        const updatedGallery = program.gallery.filter((_, i) => i !== indexToDelete);

        const formData = new FormData();
        formData.append('gallery', JSON.stringify(updatedGallery));
        const removedKey = program.gallery[indexToDelete]?._key;
        const currentEnglish = program.translations?.en || {};
        formData.append(
          'translations',
          JSON.stringify({
            en: {
              ...currentEnglish,
              gallery: (currentEnglish.gallery || []).filter(
                (item, index) =>
                  removedKey ? item._key !== removedKey : index !== indexToDelete,
              ),
            },
          }),
        );

        // Send PUT request
        const res = await fetch(`${API_BASE}/admin/programs/${id}`, {
          method: 'PUT',
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Photo has been deleted.',
            timer: 1500,
            showConfirmButton: false
          });
          fetchProgram();
        } else {
          throw new Error(data.error || 'Failed to delete photo');
        }
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete photo.',
        });
      }
    }
  };

  const handleMovePhoto = async (
    indexToMove: number,
    direction: -1 | 1,
  ) => {
    if (!program) return;
    const reorderedGallery = moveArrayItem(
      program.gallery,
      indexToMove,
      direction,
    );
    if (reorderedGallery === program.gallery) return;

    const currentEnglish = program.translations?.en || {};
    const englishGallery = currentEnglish.gallery || [];
    const reorderedEnglishGallery = reorderedGallery.map(
      (baseItem, index) =>
        englishGallery.find(
          (translatedItem) => translatedItem._key === baseItem._key,
        ) ||
        englishGallery[index] || {
          _key: baseItem._key,
          title: '',
          shortDescription: '',
        },
    );

    try {
      const formData = new FormData();
      formData.append('gallery', JSON.stringify(reorderedGallery));
      formData.append(
        'translations',
        JSON.stringify({
          en: {
            ...currentEnglish,
            gallery: reorderedEnglishGallery,
          },
        }),
      );
      const response = await fetch(`${API_BASE}/admin/programs/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to reorder');
      await fetchProgram();
    } catch (error) {
      console.error('Reorder error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to reorder photos.',
      });
    }
  };

  // Pagination Logic
  const totalItems = program?.gallery?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedGallery = program?.gallery?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ) || [];
  const missingEnglishCount = newPhotos.reduce((count, photo) => {
    if (photo.title.trim() && !photo.englishTitle?.trim()) count += 1;
    if (
      photo.shortDescription.trim() &&
      !photo.englishShortDescription?.trim()
    ) {
      count += 1;
    }
    return count;
  }, 0);


  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Icon icon="svg-spinners:ring-resize" className="w-10 h-10 text-primary mx-auto mb-2" />
            <p className="text-gray-500">Loading gallery...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!program) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/admin/programs">
              <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Program Gallery</h1>
              <p className="text-sm text-gray-500 line-clamp-1 max-w-md">For: <span className="font-semibold text-primary">{program.title}</span></p>
            </div>
          </div>
          <Button onClick={handleOpenModal} className="shrink-0 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Photos
          </Button>
        </div>

        <Separator />

        {/* Gallery Grid */}
        <Card className="border-none shadow-none bg-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGallery.length > 0 ? (
              paginatedGallery.map((item, index) => {
                // Determine absolute index for deletion
                const absoluteIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;

                return (
                  <div key={index} className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <p className="text-white text-sm line-clamp-2">{item.shortDescription}</p>
                      </div>

                      {/* Delete Button */}
                      <div className="absolute left-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleMovePhoto(absoluteIndex, -1)}
                          disabled={absoluteIndex === 0}
                          className="rounded-full bg-white/90 p-2 text-gray-700 shadow-sm hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Move photo earlier"
                        >
                          <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMovePhoto(absoluteIndex, 1)}
                          disabled={absoluteIndex === totalItems - 1}
                          className="rounded-full bg-white/90 p-2 text-gray-700 shadow-sm hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Move photo later"
                        >
                          <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(absoluteIndex)}
                          className="rounded-full bg-white/90 p-2 text-primary shadow-sm hover:bg-white"
                          aria-label="Edit photo translations"
                        >
                          <Icon icon="solar:pen-linear" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(absoluteIndex)}
                          className="rounded-full bg-white/90 p-2 text-red-500 shadow-sm hover:bg-white hover:text-red-600"
                          aria-label="Delete photo"
                        >
                          <Icon icon="solar:trash-bin-trash-bold" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate" title={item.title}>{item.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.shortDescription}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Icon icon="solar:gallery-wide-linear" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No photos yet</h3>
                <p className="text-gray-500 mb-6">Start building the gallery by adding some photos.</p>
                <Button variant="outline" onClick={handleOpenModal}>Add Your First Photo</Button>
              </div>
            )}
          </div>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-gray-700 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

      </div>

      {/* Add Photos Modal */}
      <Dialog
        modal={false}
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open && !Swal.isVisible()) void handleCloseModal();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto w-full">
          <DialogHeader>
            <DialogTitle>
              {editingPhotoIndex === null
                ? 'Add Photos to Gallery'
                : 'Edit Gallery Photo'}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            onInputCapture={() => setIsDirty(true)}
            onChangeCapture={() => setIsDirty(true)}
            className="mt-4 space-y-6"
          >
            <div
              className="sticky top-0 z-20 flex rounded-xl border bg-white p-1 shadow-sm"
              role="tablist"
              aria-label="Gallery content language"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeLanguage === 'id'}
                onClick={() => setActiveLanguage('id')}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeLanguage === 'id'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Indonesia
                <span className="ml-2 text-xs opacity-80">Required</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeLanguage === 'en'}
                onClick={() => setActiveLanguage('en')}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeLanguage === 'en'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                English
                <span className="ml-2 text-xs opacity-80">
                  Optional · {missingEnglishCount} missing
                </span>
              </button>
            </div>

            {activeLanguage === 'en' && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                English is optional. Indonesian text is shown as a reference
                and will be used as fallback when English is empty.
              </div>
            )}

            <div className="space-y-4">
              {newPhotos.map((photo, index) => (
                <GalleryInputRow
                  key={index}
                  item={photo}
                  index={index}
                  language={activeLanguage}
                  updateItem={updatePhotoInput}
                  removeItem={removePhotoInput}
                />
              ))}
            </div>

            {editingPhotoIndex === null && (
              <div className="flex justify-center">
                <Button type="button" variant="outline" onClick={addPhotoInput} className="w-full border-dashed">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Photo
                </Button>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white py-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => void handleCloseModal()}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading} className="bg-primary text-white min-w-[100px]">
                {uploading ? (
                  <>
                    <Icon icon="svg-spinners:ring-resize" className="w-4 h-4 mr-2" />
                    Uploading...
                  </>
                ) : editingPhotoIndex === null ? 'Save Photos' : 'Update Photo'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
