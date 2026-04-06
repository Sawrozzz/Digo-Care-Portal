/* eslint-disable @typescript-eslint/no-explicit-any */
export const toFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    }
    // Handle nested objects (basic)
    else if (typeof value === "object" && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    }
    // File or primitive
    else {
      formData.append(key, value);
    }
  });

  return formData;
};
