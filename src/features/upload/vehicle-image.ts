const acceptedVehicleImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function isSupportedVehicleImage(file: Pick<File, "type">) {
  return acceptedVehicleImageTypes.has(file.type);
}
