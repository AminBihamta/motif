"use server";

const acceptedTypes = new Set(["image/jpeg", "image/png"]);
const maxFileSize = 5 * 1024 * 1024;

export async function analyzeImages(formData: FormData) {
  const files = Array.from({ length: 5 }, (_, index) => {
    return formData.get(`files${index + 1}`);
  }).filter((file): file is File => file instanceof File && file.size > 0);
  if (files.length != 5) {
    return { error: "Please upload 5 files" };
  }

  for (const file of files) {
    if (!acceptedTypes.has(file.type)) {
      return { error: "Only JPG and PNG files are allowed." };
    }


    if (file.size > maxFileSize) {
      return { error: "Each image must be smaller than 5 MB." };
    }
  }

  console.log(
    files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    })),
  );

  return {
    success: true,
    count: files.length,
  }
}
