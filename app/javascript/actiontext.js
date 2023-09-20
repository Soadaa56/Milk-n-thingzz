// Copied from node_modules/@rails/actiontext/app/javascript/actiontext/attachment_upload.js
class AttachmentUpload {
  constructor(attachment, element) {
    this.attachment = attachment;
    this.element = element;
    // Requires `require activestorage` in application.js
    this.directUpload = new ActiveStorage.DirectUpload(
      attachment.file,
      this.directUploadUrl,
      this
    );
  }

  start() {
    this.directUpload.create(this.directUploadDidComplete.bind(this));
  }

  directUploadWillStoreFileWithXHR(xhr) {
    xhr.upload.addEventListener("progress", event => {
      const progress = (event.loaded / event.total) * 100;
      this.attachment.setUploadProgress(progress);
    });
  }

  directUploadDidComplete(error, attributes) {
    if (error) {
      throw new Error(`Direct upload failed: ${error}`);
    }

    this.attachment.setAttributes({
      sgid: attributes.attachable_sgid,
      url: this.createBlobUrl(attributes.signed_id, attributes.filename)
    });
  }

  createBlobUrl(signedId, filename) {
    return this.blobUrlTemplate
      .replace(":signed_id", signedId)
      .replace(":filename", encodeURIComponent(filename));
  }

  get directUploadUrl() {
    return this.element.dataset.directUploadUrl;
  }

  get blobUrlTemplate() {
    return this.element.dataset.blobUrlTemplate;
  }
}

// Copied from node_modules/@rails/actiontext/app/javascript/actiontext/index.js
addEventListener("trix-attachment-add", event => {
  const { attachment, target } = event;

  if (attachment.file) {
    const upload = new AttachmentUpload(attachment, target);
    upload.start();
  }
});