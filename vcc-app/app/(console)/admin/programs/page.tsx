'use client';

import {
  useState,
  useEffect,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { Icon } from '@iconify/react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import Link from 'next/link';

import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { VCCBE_ADMIN_API_URL } from '@/lib/vccbe-config';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Swal from 'sweetalert2';

interface Country {
  id: string;
  name: string;
  flagImage: string;
}

// Interfaces for nested objects
interface Objective {
  _key?: string;
  sticker: string;
  title: string;
  description: string;
}

interface TimelineItem {
  _key?: string;
  title: string;
  description: string;
  image?: string | null;
  imageFile?: File | null; // For upload
}

interface ScholarshipItem {
  _key?: string;
  sticker: string;
  title: string;
  description: string;
  image?: string | null;
  imageFile?: File | null; // For upload
}

interface ContactPerson {
  email: string;
  phoneNumber: string;
}

interface GalleryItem {
  _key?: string;
  imageUrl: string;
  title: string;
  shortDescription: string;
}

interface Program {
  id: string;
  title: string;
  thumbnail: string;
  shortDescription: string;
  description: string;
  countryId: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  country: Country;
  eligibleStudyPrograms?: string[];
  objectives?: Objective[];
  timelineDescription?: string;
  timeline?: TimelineItem[];
  scholarshipDescription?: string;
  scholarships?: ScholarshipItem[];
  contactPersons?: ContactPerson[];
  mainColor?: string;
  customSections?: CustomSection[];
  gallery?: GalleryItem[];
  translations?: {
    id?: ProgramTranslation | null;
    en?: ProgramTranslation | null;
  };
}

interface CustomSectionCard {
  _key?: string;
  title: string;
  description: string;
  image?: string | null;
  imageFile?: File | null;
}

interface CustomSection {
  _key?: string;
  title: string;
  description: string;
  layout: 'grid' | 'carousel';
  cards: CustomSectionCard[];
}

type UpdateTimelineItem = <K extends keyof TimelineItem>(
  index: number,
  field: K,
  value: TimelineItem[K],
) => void;

type UpdateScholarshipItem = <K extends keyof ScholarshipItem>(
  index: number,
  field: K,
  value: ScholarshipItem[K],
) => void;

type UpdateCustomSectionCard = <K extends keyof CustomSectionCard>(
  sectionIndex: number,
  cardIndex: number,
  field: K,
  value: CustomSectionCard[K],
) => void;

interface TranslatedItem {
  _key: string;
  title: string;
  description: string;
  cards?: TranslatedItem[];
}

interface TranslatedGalleryItem {
  _key: string;
  title: string;
  shortDescription: string;
}

interface ProgramTranslation {
  title?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  timelineDescription?: string | null;
  scholarshipDescription?: string | null;
  objectives?: TranslatedItem[];
  timeline?: TranslatedItem[];
  scholarships?: TranslatedItem[];
  customSections?: TranslatedItem[];
  gallery?: TranslatedGalleryItem[];
}

type EnglishTranslationDraft = {
  title: string;
  shortDescription: string;
  description: string;
  timelineDescription: string;
  scholarshipDescription: string;
  objectives: TranslatedItem[];
  timeline: TranslatedItem[];
  scholarships: TranslatedItem[];
  customSections: TranslatedItem[];
  gallery: TranslatedGalleryItem[];
};

const emptyEnglishTranslation = (): EnglishTranslationDraft => ({
  title: '',
  shortDescription: '',
  description: '',
  timelineDescription: '',
  scholarshipDescription: '',
  objectives: [],
  timeline: [],
  scholarships: [],
  customSections: [],
  gallery: [],
});

const createStableKey = (prefix: string) =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const ensureStableKeys = <T extends { _key?: string; cards?: Array<{ _key?: string }> }>(
  items: T[],
  prefix: string,
): T[] =>
  items.map((item, index) => ({
    ...item,
    _key: item._key || createStableKey(`${prefix}-${index}`),
    ...(Array.isArray(item.cards)
      ? {
          cards: item.cards.map((card, cardIndex) => ({
            ...card,
            _key:
              card._key ||
              createStableKey(`${prefix}-${index}-card-${cardIndex}`),
          })),
        }
      : {}),
  })) as T[];

const moveArrayItem = <T,>(
  items: T[],
  index: number,
  direction: -1 | 1,
) => {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
};

const translationDraft = (
  translation?: ProgramTranslation | null,
): EnglishTranslationDraft => ({
  ...emptyEnglishTranslation(),
  ...(translation || {}),
  title: translation?.title || '',
  shortDescription: translation?.shortDescription || '',
  description: translation?.description || '',
  timelineDescription: translation?.timelineDescription || '',
  scholarshipDescription: translation?.scholarshipDescription || '',
  objectives: translation?.objectives || [],
  timeline: translation?.timeline || [],
  scholarships: translation?.scholarships || [],
  customSections: translation?.customSections || [],
  gallery: translation?.gallery || [],
});

const hasText = (value: string | null | undefined) =>
  Boolean(value?.trim());

const countMissingEnglishFields = ({
  draft,
  indonesian,
  objectives,
  timeline,
  scholarships,
  customSections,
  gallery,
}: {
  draft: EnglishTranslationDraft;
  indonesian: {
    title: string;
    shortDescription: string;
    description: string;
    timelineDescription: string;
    scholarshipDescription: string;
  };
  objectives: Objective[];
  timeline: TimelineItem[];
  scholarships: ScholarshipItem[];
  customSections: CustomSection[];
  gallery: GalleryItem[];
}) => {
  let missing = 0;
  const check = (
    baseValue: string | null | undefined,
    translatedValue: string | null | undefined,
  ) => {
    if (hasText(baseValue) && !hasText(translatedValue)) missing += 1;
  };

  check(indonesian.title, draft.title);
  check(indonesian.shortDescription, draft.shortDescription);
  check(indonesian.description, draft.description);
  check(indonesian.timelineDescription, draft.timelineDescription);
  check(
    indonesian.scholarshipDescription,
    draft.scholarshipDescription,
  );

  const checkItems = (
    baseItems: Array<{ _key?: string; title: string; description: string }>,
    translatedItems: TranslatedItem[],
  ) => {
    baseItems.forEach((item) => {
      const translated = translatedItems.find(
        (entry) => entry._key === item._key,
      );
      check(item.title, translated?.title);
      check(item.description, translated?.description);
    });
  };

  checkItems(objectives, draft.objectives);
  checkItems(timeline, draft.timeline);
  checkItems(scholarships, draft.scholarships);

  customSections.forEach((section) => {
    const translatedSection = draft.customSections.find(
      (entry) => entry._key === section._key,
    );
    check(section.title, translatedSection?.title);
    check(section.description, translatedSection?.description);
    checkItems(section.cards, translatedSection?.cards || []);
  });

  gallery.forEach((item) => {
    const translated = draft.gallery.find(
      (entry) => entry._key === item._key,
    );
    check(item.title, translated?.title);
    check(item.shortDescription, translated?.shortDescription);
  });

  return missing;
};

const API_BASE = VCCBE_ADMIN_API_URL;

const STUDY_PROGRAMS = [
  "All Program Study", "KMN", "EKW", "TPL", "TRK", "SJMP", "GZI", "PTB", "IKN", "TNK", "MAB", "MNI", "KIM", "LNK", "AKN", "PVT", "TMP", "PPP"
];

// Sub-component for Timeline Item to handle its own Dropzone hook
const TimelineItemRow = ({
  item,
  index,
  updateTimelineItem,
  removeTimelineItem,
  moveTimelineItem,
  itemCount,
}: {
  item: TimelineItem;
  index: number;
  updateTimelineItem: UpdateTimelineItem;
  removeTimelineItem: (index: number) => void;
  moveTimelineItem: (index: number, direction: -1 | 1) => void;
  itemCount: number;
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
      updateTimelineItem(index, 'imageFile', file);
    }
  }, [index, updateTimelineItem]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 1 * 1024 * 1024,
    multiple: false
  });

  const previewUrl = item.imageFile
    ? URL.createObjectURL(item.imageFile)
    : item.image;

  return (
    <div className="p-3 bg-gray-50 rounded space-y-3 relative">
      <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">Step {index + 1}</div>
      <div className="absolute right-1 top-1 flex">
        <Button type="button" variant="ghost" size="icon" disabled={index === 0} onClick={() => moveTimelineItem(index, -1)} aria-label="Move step up"><Icon icon="solar:arrow-up-linear" /></Button>
        <Button type="button" variant="ghost" size="icon" disabled={index === itemCount - 1} onClick={() => moveTimelineItem(index, 1)} aria-label="Move step down"><Icon icon="solar:arrow-down-linear" /></Button>
        <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => removeTimelineItem(index)}><Icon icon="solar:trash-bin-trash-linear" /></Button>
      </div>
      <div className="mt-6 space-y-3">
        <div>
          <Label className="text-xs">Title</Label>
          <Input value={item.title} onChange={e => updateTimelineItem(index, 'title', e.target.value)} placeholder="Step Title" />
        </div>
        <div>
          <Label className="text-xs">Description</Label>
          <Textarea value={item.description} onChange={e => updateTimelineItem(index, 'description', e.target.value)} placeholder="Step Description" rows={2} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Image (Optional)</Label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors ${isDragActive ? 'bg-gray-200 border-primary' : 'bg-white'}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-2">
              <Icon icon="solar:upload-linear" className="w-8 h-8 text-gray-400" />
              {isDragActive ? (
                <p className="text-xs text-gray-500">Drop here...</p>
              ) : (
                <>
                  <p className="text-sm font-semibold text-gray-700"><span className='text-green-500'>Upload</span> / Drag & Drop</p>
                  <p className="text-[10px] text-gray-500">Max 1MB</p>
                </>
              )}
            </div>
          </div>
          {previewUrl && (
            <div className="relative mt-2 w-full max-w-[200px]">
              <img src={previewUrl} alt="Preview" className="h-24 w-auto object-cover rounded border" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 bg-white rounded-full shadow-sm text-error h-6 w-6 border"
                onClick={(e) => {
                  e.stopPropagation();
                  updateTimelineItem(index, 'imageFile', null);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for Scholarship Item
const ScholarshipItemRow = ({
  item,
  index,
  updateScholarshipItem,
  removeScholarshipItem,
  moveScholarshipItem,
  itemCount,
}: {
  item: ScholarshipItem;
  index: number;
  updateScholarshipItem: UpdateScholarshipItem;
  removeScholarshipItem: (index: number) => void;
  moveScholarshipItem: (index: number, direction: -1 | 1) => void;
  itemCount: number;
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
      updateScholarshipItem(index, 'imageFile', file);
    }
  }, [index, updateScholarshipItem]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 1 * 1024 * 1024,
    multiple: false
  });

  const previewUrl = item.imageFile
    ? URL.createObjectURL(item.imageFile)
    : item.image;

  return (
    <div className="pt-12 pb-3 px-3 bg-gray-50 rounded space-y-3 relative">
      <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">Scholarship {index + 1}</div>
      <div className="absolute right-1 top-1 flex">
        <Button type="button" variant="ghost" size="icon" disabled={index === 0} onClick={() => moveScholarshipItem(index, -1)} aria-label="Move scholarship up"><Icon icon="solar:arrow-up-linear" /></Button>
        <Button type="button" variant="ghost" size="icon" disabled={index === itemCount - 1} onClick={() => moveScholarshipItem(index, 1)} aria-label="Move scholarship down"><Icon icon="solar:arrow-down-linear" /></Button>
        <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => removeScholarshipItem(index)}><Icon icon="solar:trash-bin-trash-linear" /></Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <Label className="text-xs">Sticker</Label>
          <Input value={item.sticker} onChange={e => updateScholarshipItem(index, 'sticker', e.target.value)} placeholder="💰" />
        </div>
        <div className="md:col-span-3">
          <Label className="text-xs">Title</Label>
          <Input value={item.title} onChange={e => updateScholarshipItem(index, 'title', e.target.value)} placeholder="Scholarship Name" />
        </div>
      </div>
      <div>
        <Label className="text-xs">Description</Label>
        <Textarea value={item.description} onChange={e => updateScholarshipItem(index, 'description', e.target.value)} placeholder="Details..." rows={2} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Image (Optional)</Label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors ${isDragActive ? 'bg-gray-200 border-primary' : 'bg-white'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Icon icon="solar:upload-linear" className="w-8 h-8 text-gray-400" />
            {isDragActive ? (
              <p className="text-xs text-gray-500">Drop here...</p>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-700"><span className='text-green-500'>Upload</span> / Drag & Drop</p>
                <p className="text-[10px] text-gray-500">Max 1MB</p>
              </>
            )}
          </div>
        </div>
        {previewUrl && (
          <div className="relative mt-2 w-full max-w-[200px]">
            <img src={previewUrl} alt="Preview" className="h-24 w-auto object-cover rounded border" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 bg-white rounded-full shadow-sm text-error h-6 w-6 border"
              onClick={(e) => {
                e.stopPropagation();
                updateScholarshipItem(index, 'imageFile', null);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component for Custom Section Card
const CustomSectionCardRow = ({
  card,
  cardIndex,
  sectionIndex,
  updateCard,
  removeCard,
  moveCard,
  cardCount,
}: {
  card: CustomSectionCard;
  cardIndex: number;
  sectionIndex: number;
  updateCard: UpdateCustomSectionCard;
  removeCard: (sIndex: number, cIndex: number) => void;
  moveCard: (sIndex: number, cIndex: number, direction: -1 | 1) => void;
  cardCount: number;
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
      updateCard(sectionIndex, cardIndex, 'imageFile', file);
    }
  }, [sectionIndex, cardIndex, updateCard]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 1 * 1024 * 1024,
    multiple: false
  });

  const previewUrl = card.imageFile
    ? URL.createObjectURL(card.imageFile)
    : card.image;

  return (
    <div className="p-3 bg-white border rounded space-y-3 relative">
      <div className="absolute right-1 top-1 flex">
        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled={cardIndex === 0} onClick={() => moveCard(sectionIndex, cardIndex, -1)} aria-label="Move card left"><Icon icon="solar:arrow-left-linear" width={14} /></Button>
        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled={cardIndex === cardCount - 1} onClick={() => moveCard(sectionIndex, cardIndex, 1)} aria-label="Move card right"><Icon icon="solar:arrow-right-linear" width={14} /></Button>
        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeCard(sectionIndex, cardIndex)}><Icon icon="solar:trash-bin-trash-linear" width={16} /></Button>
      </div>
      <div className="space-y-2 mt-4">
        <div>
          <Label className="text-xs">Card Title</Label>
          <Input value={card.title} onChange={e => updateCard(sectionIndex, cardIndex, 'title', e.target.value)} placeholder="Card Title" className="h-8 text-sm" />
        </div>
        <div>
          <Label className="text-xs">Card Description</Label>
          <Textarea value={card.description} onChange={e => updateCard(sectionIndex, cardIndex, 'description', e.target.value)} placeholder="Card Description" rows={2} className="text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Image</Label>
          <div
            {...getRootProps()}
            className={`border border-dashed border-gray-300 rounded p-2 text-center cursor-pointer hover:bg-gray-50 transition-colors ${isDragActive ? 'bg-gray-100' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center">
              <Icon icon="solar:upload-linear" className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] text-gray-500">Upload Image</span>
            </div>
          </div>
          {previewUrl && (
            <div className="relative mt-1 w-16 h-16">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded border" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 bg-white rounded-full shadow-sm text-error h-5 w-5 border p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCard(sectionIndex, cardIndex, 'imageFile', null);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function EnglishTranslationEditor({
  draft,
  setDraft,
  indonesian,
  missingCount,
  objectives,
  timeline,
  scholarships,
  customSections,
}: {
  draft: EnglishTranslationDraft;
  setDraft: Dispatch<SetStateAction<EnglishTranslationDraft>>;
  indonesian: {
    title: string;
    shortDescription: string;
    description: string;
    timelineDescription: string;
    scholarshipDescription: string;
  };
  missingCount: number;
  objectives: Objective[];
  timeline: TimelineItem[];
  scholarships: ScholarshipItem[];
  customSections: CustomSection[];
}) {
  const updateItem = (
    list: 'objectives' | 'timeline' | 'scholarships',
    key: string,
    field: 'title' | 'description',
    value: string,
  ) => {
    setDraft((current) => {
      const existing = current[list].find((item) => item._key === key);
      const next = existing
        ? current[list].map((item) =>
            item._key === key ? { ...item, [field]: value } : item,
          )
        : [
            ...current[list],
            { _key: key, title: '', description: '', [field]: value },
          ];
      return { ...current, [list]: next };
    });
  };

  const updateSection = (
    sectionKey: string,
    field: 'title' | 'description',
    value: string,
  ) => {
    setDraft((current) => {
      const existing = current.customSections.find(
        (section) => section._key === sectionKey,
      );
      const next = existing
        ? current.customSections.map((section) =>
            section._key === sectionKey
              ? { ...section, [field]: value }
              : section,
          )
        : [
            ...current.customSections,
            {
              _key: sectionKey,
              title: '',
              description: '',
              cards: [],
              [field]: value,
            },
          ];
      return { ...current, customSections: next };
    });
  };

  const updateCard = (
    sectionKey: string,
    cardKey: string,
    field: 'title' | 'description',
    value: string,
  ) => {
    setDraft((current) => {
      const section = current.customSections.find(
        (item) => item._key === sectionKey,
      ) || {
        _key: sectionKey,
        title: '',
        description: '',
        cards: [],
      };
      const cards = section.cards || [];
      const card = cards.find((item) => item._key === cardKey);
      const nextCards = card
        ? cards.map((item) =>
            item._key === cardKey ? { ...item, [field]: value } : item,
          )
        : [
            ...cards,
            { _key: cardKey, title: '', description: '', [field]: value },
          ];
      const nextSection = { ...section, cards: nextCards };
      const hasSection = current.customSections.some(
        (item) => item._key === sectionKey,
      );
      return {
        ...current,
        customSections: hasSection
          ? current.customSections.map((item) =>
              item._key === sectionKey ? nextSection : item,
            )
          : [...current.customSections, nextSection],
      };
    });
  };

  const translatedList = (
    label: string,
    listName: 'objectives' | 'timeline' | 'scholarships',
    baseItems: Array<{ _key?: string; title: string; description: string }>,
  ) => (
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="font-semibold text-primary">{label}</h3>
      {baseItems.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Add the structure in the Indonesia tab first.
        </p>
      ) : (
        baseItems.map((baseItem, index) => {
          const key = baseItem._key!;
          const translated = draft[listName].find(
            (item) => item._key === key,
          );
          return (
            <div key={key} className="space-y-2 rounded-md bg-gray-50 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                {label} {index + 1}
              </p>
              <Input
                value={translated?.title || ''}
                onChange={(event) =>
                  updateItem(listName, key, 'title', event.target.value)
                }
                placeholder={baseItem.title || 'Indonesian title reference'}
              />
              <Textarea
                value={translated?.description || ''}
                onChange={(event) =>
                  updateItem(
                    listName,
                    key,
                    'description',
                    event.target.value,
                  )
                }
                placeholder={
                  baseItem.description || 'Indonesian description reference'
                }
                rows={2}
              />
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        English is optional. {missingCount} text field
        {missingCount === 1 ? '' : 's'} will currently fall back to Indonesian.
        Indonesian text shown as placeholders is reference only and will not be
        saved.
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold text-lg text-primary">
          English Program Content
        </h3>
        <div className="space-y-2">
          <Label>Program Title</Label>
          <Input
            value={draft.title}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            placeholder={indonesian.title || 'Indonesian title reference'}
          />
        </div>
        <div className="space-y-2">
          <Label>Short Description</Label>
          <Textarea
            value={draft.shortDescription}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                shortDescription: event.target.value,
              }))
            }
            rows={2}
            placeholder={
              indonesian.shortDescription ||
              'Indonesian short description reference'
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Full Description</Label>
          <Textarea
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            rows={4}
            placeholder={
              indonesian.description || 'Indonesian description reference'
            }
          />
        </div>
      </div>

      {translatedList('Objectives', 'objectives', objectives)}

      <div className="space-y-2 rounded-lg border p-4">
        <Label>Timeline General Description</Label>
        <Textarea
          value={draft.timelineDescription}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              timelineDescription: event.target.value,
            }))
          }
          rows={2}
          placeholder={
            indonesian.timelineDescription ||
            'Indonesian timeline description reference'
          }
        />
      </div>
      {translatedList('Timeline Steps', 'timeline', timeline)}

      <div className="space-y-2 rounded-lg border p-4">
        <Label>Scholarship General Description</Label>
        <Textarea
          value={draft.scholarshipDescription}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              scholarshipDescription: event.target.value,
            }))
          }
          rows={2}
          placeholder={
            indonesian.scholarshipDescription ||
            'Indonesian scholarship description reference'
          }
        />
      </div>
      {translatedList('Scholarships', 'scholarships', scholarships)}

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold text-primary">Custom Sections</h3>
        {customSections.map((baseSection, sectionIndex) => {
          const sectionKey = baseSection._key!;
          const translatedSection = draft.customSections.find(
            (section) => section._key === sectionKey,
          );
          return (
            <div key={sectionKey} className="space-y-3 rounded-md bg-gray-50 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Section {sectionIndex + 1}
              </p>
              <Input
                value={translatedSection?.title || ''}
                onChange={(event) =>
                  updateSection(sectionKey, 'title', event.target.value)
                }
                placeholder={baseSection.title || 'Indonesian section title'}
              />
              <Textarea
                value={translatedSection?.description || ''}
                onChange={(event) =>
                  updateSection(
                    sectionKey,
                    'description',
                    event.target.value,
                  )
                }
                placeholder={
                  baseSection.description || 'Indonesian section description'
                }
                rows={2}
              />
              {baseSection.cards.map((baseCard, cardIndex) => {
                const cardKey = baseCard._key!;
                const translatedCard = translatedSection?.cards?.find(
                  (card) => card._key === cardKey,
                );
                return (
                  <div key={cardKey} className="space-y-2 border-l-2 pl-3">
                    <Label className="text-xs">Card {cardIndex + 1}</Label>
                    <Input
                      value={translatedCard?.title || ''}
                      onChange={(event) =>
                        updateCard(
                          sectionKey,
                          cardKey,
                          'title',
                          event.target.value,
                        )
                      }
                      placeholder={baseCard.title || 'Indonesian card title'}
                    />
                    <Textarea
                      value={translatedCard?.description || ''}
                      onChange={(event) =>
                        updateCard(
                          sectionKey,
                          cardKey,
                          'description',
                          event.target.value,
                        )
                      }
                      placeholder={
                        baseCard.description ||
                        'Indonesian card description'
                      }
                      rows={2}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'id' | 'en'>('id');
  const [englishTranslation, setEnglishTranslation] =
    useState<EnglishTranslationDraft>(emptyEnglishTranslation);
  const [isDirty, setIsDirty] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    countryId: '',
    // eligibleStudyPrograms removed from here since we use separate state
    timelineDescription: '',
    scholarshipDescription: '',
    isPublished: false,
    mainColor: '#000000',
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  // Dropzone for Thumbnail
  const onDropThumbnail = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
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
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps, isDragActive: isThumbnailDragActive } = useDropzone({
    onDrop: onDropThumbnail,
    accept: { 'image/*': [] },
    maxSize: 1 * 1024 * 1024,
    multiple: false
  });

  // Eligible Study Programs State
  const [selectedStudyPrograms, setSelectedStudyPrograms] = useState<string[]>([]);
  const [openCombobox, setOpenCombobox] = useState(false);

  // Dynamic Lists States
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);

  // Search/Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterPublished, setFilterPublished] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);

  const englishMissingCount = countMissingEnglishFields({
    draft: englishTranslation,
    indonesian: formData,
    objectives,
    timeline,
    scholarships,
    customSections,
    gallery: editingProgram?.gallery || [],
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchCountries();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchPrograms();
  }, [currentPage, searchQuery, filterCountry, filterPublished]);

  const fetchCountries = async () => {
    try {
      setLoadingCountries(true);
      const response = await fetch(`${API_BASE}/countries?limit=100`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      if (data.success) {
        setCountries(data.data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchQuery && { search: searchQuery }),
        ...(filterCountry && filterCountry !== 'all' && { countryId: filterCountry }),
        ...(filterPublished && filterPublished !== 'all' && { isPublished: filterPublished }),
      });
      const response = await fetch(`${API_BASE}/programs?${params}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      if (data.success) {
        setPrograms(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch programs',
        timer: 1500,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (program?: Program) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        title: program.title,
        shortDescription: program.shortDescription,
        description: program.description,
        countryId: program.countryId,
        timelineDescription: program.timelineDescription || '',
        scholarshipDescription: program.scholarshipDescription || '',
        isPublished: program.isPublished,
        mainColor: program.mainColor || '#000000',
      });
      setThumbnailPreview(program.thumbnail);
      setThumbnailFile(null);
      setSelectedStudyPrograms(program.eligibleStudyPrograms || []);
      setObjectives(ensureStableKeys(program.objectives || [], 'objective'));
      setTimeline(ensureStableKeys(program.timeline || [], 'timeline'));
      setScholarships(
        ensureStableKeys(program.scholarships || [], 'scholarship'),
      );
      setContactPersons(program.contactPersons || []);
      setCustomSections(
        ensureStableKeys(program.customSections || [], 'custom-section'),
      );
      setEnglishTranslation(translationDraft(program.translations?.en));
    } else {
      setEditingProgram(null);
      setFormData({
        title: '',
        shortDescription: '',
        description: '',
        countryId: '',
        timelineDescription: '',
        scholarshipDescription: '',
        isPublished: false,
        mainColor: '#000000',
      });
      setThumbnailPreview('');
      setThumbnailFile(null);
      setSelectedStudyPrograms([]);
      setObjectives([]);
      setTimeline([]); // Require at least one?
      setScholarships([]);
      setScholarships([]);
      setContactPersons([]);
      setCustomSections([]);
      setEnglishTranslation(emptyEnglishTranslation());
    }
    setActiveLanguage('id');
    setIsDirty(false);
    setIsModalOpen(true);
  };

  const closeModalImmediately = () => {
    setIsModalOpen(false);
    setEditingProgram(null);
    setThumbnailPreview('');
    setThumbnailFile(null);
    setIsDirty(false);
  };

  const handleCloseModal = async () => {
    if (isDirty) {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Discard unsaved changes?',
        text: 'Your changes to this program have not been saved.',
        showCancelButton: true,
        confirmButtonText: 'Discard changes',
        cancelButtonText: 'Continue editing',
        confirmButtonColor: '#dc2626',
      });
      if (!result.isConfirmed) return;
    }
    closeModalImmediately();
  };

  // --- Dynamic List Handlers ---

  // Objectives
  const addObjective = () => setObjectives([...objectives, { _key: createStableKey('objective'), sticker: '', title: '', description: '' }]);
  const removeObjective = (index: number) => setObjectives(objectives.filter((_, i) => i !== index));
  const moveObjective = (index: number, direction: -1 | 1) =>
    setObjectives((current) => moveArrayItem(current, index, direction));
  const updateObjective = (index: number, field: keyof Objective, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = { ...newObjectives[index], [field]: value };
    setObjectives(newObjectives);
  };

  // Timeline
  const addTimelineItem = () => setTimeline([...timeline, { _key: createStableKey('timeline'), title: '', description: '', image: '', imageFile: null }]);
  const removeTimelineItem = (index: number) => setTimeline(timeline.filter((_, i) => i !== index));
  const moveTimelineItem = (index: number, direction: -1 | 1) =>
    setTimeline((current) => moveArrayItem(current, index, direction));
  const updateTimelineItem: UpdateTimelineItem = useCallback(
    (index, field, value) => {
      setTimeline((current) =>
        current.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      );
    },
    [],
  );

  // Scholarships
  const addScholarshipItem = () => setScholarships([...scholarships, { _key: createStableKey('scholarship'), sticker: '', title: '', description: '', image: '', imageFile: null }]);
  const removeScholarshipItem = (index: number) => setScholarships(scholarships.filter((_, i) => i !== index));
  const moveScholarshipItem = (index: number, direction: -1 | 1) =>
    setScholarships((current) => moveArrayItem(current, index, direction));
  const updateScholarshipItem: UpdateScholarshipItem = useCallback(
    (index, field, value) => {
      setScholarships((current) =>
        current.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      );
    },
    [],
  );

  // Contact Persons
  const addContactPerson = () => setContactPersons([...contactPersons, { email: '', phoneNumber: '' }]);
  const removeContactPerson = (index: number) => setContactPersons(contactPersons.filter((_, i) => i !== index));
  const updateContactPerson = (index: number, field: keyof ContactPerson, value: string) => {
    const newContacts = [...contactPersons];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setContactPersons(newContacts);
    setContactPersons(newContacts);
  };

  // Custom Sections Handlers
  const addCustomSection = () => setCustomSections([...customSections, { _key: createStableKey('custom-section'), title: '', description: '', layout: 'grid', cards: [] }]);
  const removeCustomSection = (index: number) => setCustomSections(customSections.filter((_, i) => i !== index));
  const moveCustomSection = (index: number, direction: -1 | 1) =>
    setCustomSections((current) => moveArrayItem(current, index, direction));
  const updateCustomSection = <K extends keyof CustomSection>(
    index: number,
    field: K,
    value: CustomSection[K],
  ) => {
    const newSections = customSections.map((section, i) => {
      if (i === index) {
        return { ...section, [field]: value };
      }
      return section;
    });
    setCustomSections(newSections);
  };

  const addCustomSectionCard = (sectionIndex: number) => {
    const newSections = customSections.map((section, i) => {
      if (i === sectionIndex) {
        return {
          ...section,
          cards: [...section.cards, { _key: createStableKey('custom-card'), title: '', description: '', image: '', imageFile: null }]
        };
      }
      return section;
    });
    setCustomSections(newSections);
  };

  const removeCustomSectionCard = (sectionIndex: number, cardIndex: number) => {
    const newSections = customSections.map((section, i) => {
      if (i === sectionIndex) {
        return {
          ...section,
          cards: section.cards.filter((_, ci) => ci !== cardIndex)
        };
      }
      return section;
    });
    setCustomSections(newSections);
  };

  const moveCustomSectionCard = (
    sectionIndex: number,
    cardIndex: number,
    direction: -1 | 1,
  ) => {
    setCustomSections((current) =>
      current.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              cards: moveArrayItem(section.cards, cardIndex, direction),
            }
          : section,
      ),
    );
  };

  const updateCustomSectionCard: UpdateCustomSectionCard = (
    sectionIndex,
    cardIndex,
    field,
    value,
  ) => {
    const newSections = customSections.map((section, i) => {
      if (i === sectionIndex) {
        const newCards = section.cards.map((card, ci) => {
          if (ci === cardIndex) {
            return { ...card, [field]: value };
          }
          return card;
        });
        return { ...section, cards: newCards };
      }
      return section;
    });
    setCustomSections(newSections);
  };

  const toggleStudyProgram = (program: string) => {
    setSelectedStudyPrograms(prev => {
      // Case 1: Toggling "All Program Study"
      if (program === "All Program Study") {
        // If currently selected, deselect it (return empty)
        if (prev.includes(program)) return [];
        // If not selected, select ONLY it (clear others)
        return [program];
      }

      // Case 2: Toggling other programs
      // If "All Program Study" is currently selected
      if (prev.includes("All Program Study")) {
        // Remove "All Program Study" and add the new program
        // This effectively switches from "All" mode to "Specific" mode
        return [program];
      }

      // Standard toggle
      return prev.includes(program)
        ? prev.filter(p => p !== program)
        : [...prev, program];
    });
  };

  const removeStudyProgram = (program: string) => {
    setSelectedStudyPrograms(prev => prev.filter(p => p !== program));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredIndonesianFields = [
      {
        id: 'program-title-id',
        label: 'Program Title',
        value: formData.title,
      },
      {
        id: 'program-short-description-id',
        label: 'Short Description',
        value: formData.shortDescription,
      },
      {
        id: 'program-description-id',
        label: 'Full Description',
        value: formData.description,
      },
    ];
    const missingIndonesianField = requiredIndonesianFields.find(
      (field) => !field.value.trim(),
    );

    if (missingIndonesianField) {
      setActiveLanguage('id');
      await Swal.fire({
        icon: 'warning',
        title: 'Indonesian content is required',
        text: `${missingIndonesianField.label} must be completed before saving.`,
        confirmButtonText: 'Complete field',
      });
      requestAnimationFrame(() => {
        const input = document.getElementById(missingIndonesianField.id);
        input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        input?.focus();
      });
      return;
    }

    if (!editingProgram && !thumbnailFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid File',
        text: 'Please Select a Thumbnail Image.',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    if (!formData.countryId) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid File',
        text: 'Please Select a Country.',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    // Validate Timeline (Wajib)
    // if (timeline.length === 0 || timeline.some(item => !item.title || !item.description)) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Invalid File',
    //     text: 'Timeline/Alur Program wajib diisi minimal 1',
    //     timer: 1500,
    //     showConfirmButton: false
    //   });
    //   return;
    // }

    if (!formData.mainColor) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid File',
        text: 'Please Select a Main Color.',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    if (formData.isPublished && englishMissingCount > 0) {
      const publishConfirmation = await Swal.fire({
        icon: 'warning',
        title: 'English translation is incomplete',
        text: `${englishMissingCount} text field${englishMissingCount === 1 ? '' : 's'} will fall back to Indonesian on the English website.`,
        showCancelButton: true,
        confirmButtonText: 'Publish with fallback',
        cancelButtonText: 'Continue editing',
      });
      if (!publishConfirmation.isConfirmed) {
        setActiveLanguage('en');
        return;
      }
    }

    try {
      setUploading(true);
      const formDataToSend = new FormData();

      // Basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('countryId', formData.countryId);
      formDataToSend.append('isPublished', formData.isPublished.toString());
      formDataToSend.append('timelineDescription', formData.timelineDescription);
      formDataToSend.append('scholarshipDescription', formData.scholarshipDescription);
      formDataToSend.append('mainColor', formData.mainColor);

      // Thumbnail file
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      // Arrays
      formDataToSend.append('eligibleStudyPrograms', JSON.stringify(selectedStudyPrograms));
      formDataToSend.append('objectives', JSON.stringify(objectives));
      formDataToSend.append('contactPersons', JSON.stringify(contactPersons));

      // DEBUG: Log custom sections before sending
      console.log('Sending Custom Sections:', customSections);

      // Custom Sections
      const customSectionsForJson = customSections.map((section, sIndex) => {
        const cards = section.cards.map((card, cIndex) => {
          if (card.imageFile) {
            formDataToSend.append(
              card._key
                ? `custom_card_image_${card._key}`
                : `custom_section_${sIndex}_card_${cIndex}_image`,
              card.imageFile,
            );
            const { imageFile, ...rest } = card;
            return rest;
          }
          const { imageFile, ...rest } = card;
          return rest;
        });
        return { ...section, cards };
      });
      formDataToSend.append('customSections', JSON.stringify(customSectionsForJson));

      // DEBUG: Log FormData entries
      for (const pair of formDataToSend.entries()) {
        if (pair[0] === 'customSections') {
          console.log(pair[0], pair[1]);
        }
      }

      // Handle Nested Images (Timeline & Scholarships)
      // Send JSON without 'imageFile' property, but keep 'image' if it's a URL (string)
      const timelineForJson = timeline.map((item, index) => {
        if (item.imageFile) {
          formDataToSend.append(
            item._key
              ? `timeline_image_${item._key}`
              : `timeline_image_${index}`,
            item.imageFile,
          );
          // Return object without imageFile, image will be handled by backend
          const { imageFile, ...rest } = item;
          return rest;
        }
        const { imageFile, ...rest } = item;
        return rest;
      });
      formDataToSend.append('timeline', JSON.stringify(timelineForJson));

      const scholarshipsForJson = scholarships.map((item, index) => {
        if (item.imageFile) {
          formDataToSend.append(
            item._key
              ? `scholarship_image_${item._key}`
              : `scholarship_image_${index}`,
            item.imageFile,
          );
          const { imageFile, ...rest } = item;
          return rest;
        }
        const { imageFile, ...rest } = item;
        return rest;
      });
      formDataToSend.append('scholarships', JSON.stringify(scholarshipsForJson));
      formDataToSend.append(
        'translations',
        JSON.stringify({
          id: {
            title: formData.title,
            shortDescription: formData.shortDescription,
            description: formData.description,
            timelineDescription: formData.timelineDescription,
            scholarshipDescription: formData.scholarshipDescription,
            objectives,
            timeline: timelineForJson,
            scholarships: scholarshipsForJson,
            customSections: customSectionsForJson,
            gallery: editingProgram?.gallery || [],
          },
          en: englishTranslation,
        }),
      );


      const url = editingProgram
        ? `${API_BASE}/programs/${editingProgram.id}`
        : `${API_BASE}/programs`;
      const method = editingProgram ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message || 'Success!',
          timer: 1500,
          showConfirmButton: false
        });
        closeModalImmediately();
        fetchPrograms();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'Failed to save program',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error saving program:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save program',
        timer: 1500,
        showConfirmButton: false
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (program: Program) => {
    const result = await Swal.fire({
      title: 'Anda yakin hapus Program?',
      html: `Program <b>${program.title}</b> akan terhapus permanen! Kamu tidak akan bisa mengembalikannya!<br><br>Ketik <b>${program.title}</b> untuk mengonfirmasi.`,
      icon: 'warning',
      input: 'text',
      inputPlaceholder: program.title,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus Program!',
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        const input = Swal.getInput();

        if (confirmBtn && input) {
          confirmBtn.disabled = true;

          input.addEventListener('input', (e) => {
            if ((e.target as HTMLInputElement).value === program.title) {
              confirmBtn.disabled = false;
            } else {
              confirmBtn.disabled = true;
            }
          });
        }
      },
      preConfirm: (inputValue) => {
        if (inputValue !== program.title) {
          Swal.showValidationMessage('Nama program tidak cocok');
          return false;
        }
        return true;
      }
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE}/programs/${program.id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: data.message,
            timer: 1500,
            showConfirmButton: false
          });
          fetchPrograms();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'Failed to delete program',
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (error) {
        console.error('Error deleting program:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete program',
          timer: 1500,
          showConfirmButton: false
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">
              Programs Management
            </h1>
            <p className="text-darklink">Manage your international programs</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="gap-2">
            <Icon icon="solar:add-circle-linear" className="w-5 h-5" />
            Add Program
          </Button>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Icon
                  icon="solar:magnifer-linear"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-darklink"
                />
                <Input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={filterCountry} onValueChange={(value) => {
                setFilterCountry(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterPublished} onValueChange={(value) => {
                setFilterPublished(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Published</SelectItem>
                  <SelectItem value="false">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Programs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Icon icon="svg-spinners:ring-resize" className="w-10 h-10 text-primary" />
              </div>
            ) : programs.length === 0 ? (
              <div className="text-center py-20 text-darklink">
                <Icon icon="solar:inbox-linear" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No programs found</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thumbnail</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programs.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell>
                          <img src={program.thumbnail} alt={program.title} className="w-16 h-12 object-cover rounded" />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{program.title.length > 50 ? program.title.substring(0, 50) + '...' : program.title}</p>
                            <p className="text-sm text-darklink line-clamp-1">{program.shortDescription.length > 50 ? program.shortDescription.substring(0, 50) + '...' : program.shortDescription}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-lightsecondary text-secondary">
                            {program.country.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          {program.isPublished ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-lightsuccess text-success">
                              <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-lightwarning text-warning">
                              <span className="w-2 h-2 bg-warning rounded-full mr-2"></span>
                              Draft
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-darklink">{new Date(program.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/programs/${program.id}`}>
                              <Button variant="outline" size="icon" className="h-8 w-8 text-blue-500">
                                <Icon icon="solar:eye-linear" className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="icon" onClick={() => handleOpenModal(program)} className="h-8 w-8">
                              <Icon icon="solar:pen-linear" className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDelete(program)} className="h-8 w-8 text-error">
                              <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Pagination (Simplified) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-darklink">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                      <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>


      </div>

      <Dialog
        modal={false}
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open && !Swal.isVisible()) void handleCloseModal();
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full">
          <DialogHeader>
            <DialogTitle>{editingProgram ? 'Edit Program' : 'Add New Program'}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            onInputCapture={() => setIsDirty(true)}
            onChangeCapture={() => setIsDirty(true)}
            className="space-y-6"
          >
            <div
              className="sticky top-0 z-20 flex rounded-xl border bg-white p-1 shadow-sm"
              role="tablist"
              aria-label="Program content language"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeLanguage === 'id'}
                onClick={() => setActiveLanguage('id')}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition',
                  activeLanguage === 'id'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-gray-50',
                )}
              >
                Indonesia
                <span className="ml-2 text-xs opacity-80">Required</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeLanguage === 'en'}
                onClick={() => setActiveLanguage('en')}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition',
                  activeLanguage === 'en'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-gray-50',
                )}
              >
                English
                <span className="ml-2 text-xs opacity-80">
                  Optional · {englishMissingCount} missing
                </span>
              </button>
            </div>

            <section className="space-y-5 rounded-lg border border-slate-200 bg-slate-50/70 p-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Shared Settings
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  These settings and media are used by both language versions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select
                    value={formData.countryId}
                    onValueChange={(value) => {
                      setFormData({ ...formData, countryId: value });
                      setIsDirty(true);
                    }}
                    required
                    disabled={loadingCountries}
                  >
                    <SelectTrigger>
                      {loadingCountries ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon
                            icon="svg-spinners:ring-resize"
                            className="h-4 w-4"
                          />
                          <span>Loading...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select Country" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {countries.length > 0 ? (
                        countries.map((country) => (
                          <SelectItem key={country.id} value={country.id}>
                            {country.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No countries found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Main Color *</Label>
                  <div className="flex min-h-10 flex-wrap items-center gap-2">
                    {[
                      '#DC2626',
                      '#EA580C',
                      '#D97706',
                      '#16A34A',
                      '#059669',
                      '#0D9488',
                      '#2563EB',
                      '#4F46E5',
                      '#7C3AED',
                      '#DB2777',
                    ].map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={cn(
                          'h-8 w-8 rounded-full border-2 transition',
                          formData.mainColor?.toUpperCase() ===
                            color.toUpperCase()
                            ? 'scale-110 border-white ring-2 ring-primary ring-offset-2'
                            : 'border-transparent hover:scale-105',
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setFormData({ ...formData, mainColor: color });
                          setIsDirty(true);
                        }}
                        aria-label={`Select color ${color}`}
                      >
                        {formData.mainColor?.toUpperCase() ===
                          color.toUpperCase() && (
                          <Check className="mx-auto h-4 w-4 stroke-[3px] text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Thumbnail Image *</Label>
                <div
                  {...getThumbnailRootProps()}
                  className={cn(
                    'cursor-pointer rounded-lg border-2 border-dashed border-slate-300 bg-white p-8 text-center transition hover:bg-slate-50',
                    isThumbnailDragActive && 'border-primary bg-slate-50',
                  )}
                >
                  <input {...getThumbnailInputProps()} />
                  <Icon
                    icon="solar:upload-linear"
                    className="mx-auto mb-2 h-9 w-9 text-slate-400"
                  />
                  <p className="font-medium text-slate-700">
                    {isThumbnailDragActive
                      ? 'Drop the image here'
                      : 'Click to upload or drag and drop'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Maximum file size 1MB
                  </p>
                </div>
                {thumbnailPreview && (
                  <div className="relative mt-2 w-full max-w-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-32 rounded border object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 bg-white/90 text-error hover:bg-white"
                      onClick={(event) => {
                        event.stopPropagation();
                        setThumbnailFile(null);
                        setThumbnailPreview('');
                        setIsDirty(true);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Eligible Study Programs</Label>
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <div
                      role="combobox"
                      aria-expanded={openCombobox}
                      className="flex min-h-11 w-full cursor-pointer items-center justify-between rounded-md border border-slate-300 bg-white px-4 py-2 text-sm"
                    >
                      {selectedStudyPrograms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedStudyPrograms.map((studyProgram) => (
                            <Badge key={studyProgram} variant="secondary">
                              {studyProgram}
                              <X
                                className="ml-1 h-3 w-3 rounded-full"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  removeStudyProgram(studyProgram);
                                  setIsDirty(true);
                                }}
                              />
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Select eligible study programs...
                        </span>
                      )}
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search study program..." />
                      <CommandList>
                        <CommandEmpty>No study program found.</CommandEmpty>
                        <CommandGroup>
                          {STUDY_PROGRAMS.map((studyProgram) => (
                            <CommandItem
                              key={studyProgram}
                              value={studyProgram}
                              onSelect={() => {
                                toggleStudyProgram(studyProgram);
                                setIsDirty(true);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  selectedStudyPrograms.includes(studyProgram)
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {studyProgram}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Contact Persons</Label>
                    <p className="text-xs text-muted-foreground">
                      Contact details are shared across languages.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addContactPerson();
                      setIsDirty(true);
                    }}
                  >
                    <Icon icon="solar:add-circle-linear" />
                    Add Contact
                  </Button>
                </div>
                {contactPersons.map((contact, index) => (
                  <div
                    key={index}
                    className="relative grid grid-cols-1 gap-4 rounded-md border bg-white p-4 pr-12 md:grid-cols-2"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 text-red-500"
                      onClick={() => {
                        removeContactPerson(index);
                        setIsDirty(true);
                      }}
                    >
                      <Icon icon="solar:trash-bin-trash-linear" />
                    </Button>
                    <div>
                      <Label className="text-xs">Email</Label>
                      <Input
                        value={contact.email}
                        onChange={(event) =>
                          updateContactPerson(
                            index,
                            'email',
                            event.target.value,
                          )
                        }
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Phone / WhatsApp</Label>
                      <Input
                        value={contact.phoneNumber}
                        onChange={(event) =>
                          updateContactPerson(
                            index,
                            'phoneNumber',
                            event.target.value,
                          )
                        }
                        placeholder="+62..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 border-t border-slate-200 pt-4">
                <Checkbox
                  id="publish"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      isPublished: Boolean(checked),
                    });
                    setIsDirty(true);
                  }}
                />
                <Label htmlFor="publish" className="cursor-pointer font-medium">
                  Publish this program
                </Label>
              </div>
            </section>

            {activeLanguage === 'id' ? (
              <>
            {/* Localized Indonesian content */}
            <div className="space-y-4 border p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-primary">Indonesian Program Content</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Program Title *</Label>
                  <Input id="program-title-id" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g. Japan Internship" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Short Description *</Label>
                <Textarea id="program-short-description-id" value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} required placeholder="Brief summary..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Full Description *</Label>
                <Textarea id="program-description-id" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required placeholder="Detailed description..." rows={4} />
              </div>
            </div>

            {/* 2. Program Objectives */}
            <div className="space-y-4 border p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-primary">Program Objectives</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => { addObjective(); setIsDirty(true); }}><Icon icon="solar:add-circle-linear" /> Add Objective</Button>
              </div>
              {objectives.map((obj, i) => (
                <div key={obj._key || i} className="pt-12 pb-3 px-3 bg-gray-50 rounded space-y-3 relative">
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">Objective {i + 1}</div>
                  <div className="absolute right-1 top-1 flex">
                    <Button type="button" variant="ghost" size="icon" disabled={i === 0} onClick={() => { moveObjective(i, -1); setIsDirty(true); }} aria-label="Move objective up"><Icon icon="solar:arrow-up-linear" /></Button>
                    <Button type="button" variant="ghost" size="icon" disabled={i === objectives.length - 1} onClick={() => { moveObjective(i, 1); setIsDirty(true); }} aria-label="Move objective down"><Icon icon="solar:arrow-down-linear" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => { removeObjective(i); setIsDirty(true); }}><Icon icon="solar:trash-bin-trash-linear" /></Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">Sticker (Emoji)</Label>
                      <Input value={obj.sticker} onChange={e => updateObjective(i, 'sticker', e.target.value)} placeholder="🎯" />
                    </div>
                    <div className="md:col-span-3">
                      <Label className="text-xs">Title</Label>
                      <Input value={obj.title} onChange={e => updateObjective(i, 'title', e.target.value)} placeholder="Objective Title" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea value={obj.description} onChange={e => updateObjective(i, 'description', e.target.value)} placeholder="Objective Description" rows={2} />
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Timeline / Alur (WAJIB) */}
            <div className="space-y-4 border p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-primary">Timeline (Alur)</h3>
              <div className="space-y-2">
                <Label>General Description</Label>
                <Textarea value={formData.timelineDescription} onChange={e => setFormData({ ...formData, timelineDescription: e.target.value })} placeholder="General overview of timeline..." rows={2} />
              </div>
              <div className="flex justify-between items-center mt-2">
                <Label className="font-medium text-gray-700">Detailed Steps</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => { addTimelineItem(); setIsDirty(true); }}><Icon icon="solar:add-circle-linear" /> Add Step</Button>
              </div>
              {timeline.map((item, i) => (
                <TimelineItemRow
                  key={item._key || i}
                  item={item}
                  index={i}
                  updateTimelineItem={updateTimelineItem}
                  removeTimelineItem={(index) => {
                    removeTimelineItem(index);
                    setIsDirty(true);
                  }}
                  moveTimelineItem={(index, direction) => {
                    moveTimelineItem(index, direction);
                    setIsDirty(true);
                  }}
                  itemCount={timeline.length}
                />
              ))}
            </div>

            {/* 4. Scholarship & Financial Support */}
            <div className="space-y-4 border p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-primary">Scholarship & Financial Support</h3>
              <div className="space-y-2">
                <Label>General Description</Label>
                <Textarea value={formData.scholarshipDescription} onChange={e => setFormData({ ...formData, scholarshipDescription: e.target.value })} placeholder="General overview of scholarships..." rows={2} />
              </div>
              <div className="flex justify-between items-center mt-2">
                <Label className="font-medium text-gray-700">Detailed Scholarships</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => { addScholarshipItem(); setIsDirty(true); }}><Icon icon="solar:add-circle-linear" /> Add Scholarship</Button>
              </div>
              {scholarships.map((item, i) => (
                <ScholarshipItemRow
                  key={item._key || i}
                  item={item}
                  index={i}
                  updateScholarshipItem={updateScholarshipItem}
                  removeScholarshipItem={(index) => {
                    removeScholarshipItem(index);
                    setIsDirty(true);
                  }}
                  moveScholarshipItem={(index, direction) => {
                    moveScholarshipItem(index, direction);
                    setIsDirty(true);
                  }}
                  itemCount={scholarships.length}
                />
              ))}
            </div>

            {/* 5. Custom Sections (Free) */}
            <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-primary">Custom Sections (Optional)</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => { addCustomSection(); setIsDirty(true); }}>
                  <Icon icon="solar:add-circle-linear" className="mr-2" /> Add Section
                </Button>
              </div>

              {customSections.map((section, sIndex) => (
                <div key={section._key || sIndex} className="p-4 bg-white border rounded-lg space-y-4 relative shadow-sm">
                  <div className="absolute right-2 top-2 flex">
                    <Button type="button" variant="ghost" size="icon" disabled={sIndex === 0} onClick={() => { moveCustomSection(sIndex, -1); setIsDirty(true); }} aria-label="Move section up"><Icon icon="solar:arrow-up-linear" /></Button>
                    <Button type="button" variant="ghost" size="icon" disabled={sIndex === customSections.length - 1} onClick={() => { moveCustomSection(sIndex, 1); setIsDirty(true); }} aria-label="Move section down"><Icon icon="solar:arrow-down-linear" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => { removeCustomSection(sIndex); setIsDirty(true); }}><Icon icon="solar:trash-bin-trash-linear" /></Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 pr-28 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Section Title</Label>
                      <Input value={section.title} onChange={e => updateCustomSection(sIndex, 'title', e.target.value)} placeholder="e.g. Gallery, Student Stories" />
                    </div>
                    <div className="space-y-2">
                      <Label>Layout Style</Label>
                      <Select value={section.layout} onValueChange={val => { updateCustomSection(sIndex, 'layout', val as CustomSection['layout']); setIsDirty(true); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Layout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid (Cards)</SelectItem>
                          <SelectItem value="carousel">Carousel (Horizontal)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Section Description (Optional)</Label>
                    <Textarea value={section.description} onChange={e => updateCustomSection(sIndex, 'description', e.target.value)} placeholder="Brief description of this section..." rows={2} />
                  </div>

                  {/* Cards in Section */}
                  <div className="space-y-2 bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-center">
                      <Label className="text-secondary font-medium">Section Cards</Label>
                      <Button type="button" variant="ghost" size="sm" className="text-secondary hover:text-secondary/80" onClick={() => { addCustomSectionCard(sIndex); setIsDirty(true); }}>
                        <Icon icon="solar:add-square-linear" className="mr-1" /> Add Card
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {section.cards.map((card, cIndex) => (
                        <CustomSectionCardRow
                          key={card._key || cIndex}
                          card={card}
                          cardIndex={cIndex}
                          sectionIndex={sIndex}
                          updateCard={updateCustomSectionCard}
                          removeCard={(sectionIndex, cardIndex) => {
                            removeCustomSectionCard(sectionIndex, cardIndex);
                            setIsDirty(true);
                          }}
                          moveCard={(sectionIndex, cardIndex, direction) => {
                            moveCustomSectionCard(
                              sectionIndex,
                              cardIndex,
                              direction,
                            );
                            setIsDirty(true);
                          }}
                          cardCount={section.cards.length}
                        />
                      ))}
                      {section.cards.length === 0 && (
                        <div className="col-span-full text-center py-4 text-gray-400 text-sm">
                          No cards added yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 6. Contact Persons */}
            <div className="hidden">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-primary">Contact Persons</h3>
                <Button type="button" variant="outline" size="sm" onClick={addContactPerson}><Icon icon="solar:add-circle-linear" /> Add Contact</Button>
              </div>
              {contactPersons.map((cp, i) => (
                <div key={i} className="pt-12 pb-3 px-3 bg-gray-50 rounded relative grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">Contact Person {i + 1}</div>
                  <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 text-red-500" onClick={() => removeContactPerson(i)}><Icon icon="solar:trash-bin-trash-linear" /></Button>
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input value={cp.email} onChange={e => updateContactPerson(i, 'email', e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div>
                    <Label className="text-xs">Phone / WA</Label>
                    <Input value={cp.phoneNumber} onChange={e => updateContactPerson(i, 'phoneNumber', e.target.value)} placeholder="+62..." />
                  </div>
                </div>
              ))}
            </div>
              </>
            ) : (
              <EnglishTranslationEditor
                draft={englishTranslation}
                setDraft={setEnglishTranslation}
                indonesian={formData}
                missingCount={englishMissingCount}
                objectives={objectives}
                timeline={timeline}
                scholarships={scholarships}
                customSections={customSections}
              />
            )}

            <div className="flex gap-3 justify-end pt-4 border-t border-defaultBorder sticky bottom-0 bg-white p-4">
              <Button type="button" variant="outline" onClick={() => void handleCloseModal()} disabled={uploading}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading} className='min-w-[120px]'>
                {uploading ? (
                  <>
                    <Icon icon="svg-spinners:ring-resize" className="w-4 h-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  editingProgram ? 'Update Program' : 'Create Program'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout >
  );
}
