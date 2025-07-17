// First, install the required package:
// npm install jspdf html2canvas

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Method 1: Generate PDF from HTML content (Recommended for styled content)
export const generateProjectPDF = async (Project, tags, user) => {
  const pdf = new jsPDF("p", "mm", "a4");

  // Create HTML content for the PDF
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
        <h1 style="color: #333; margin: 0; font-size: 28px;">Project Details</h1>
        <h2 style="color: #666; margin: 10px 0; font-size: 22px;">${
          Project.name || "Project Name"
        }</h2>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Description</h3>
        <p style="line-height: 1.6; color: #555;">${
          Project.description || "No description available"
        }</p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div>
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Project Information</h3>
          <p><strong>Status:</strong> ${Project.status || "N/A"}</p>
          <p><strong>Priority:</strong> ${Project.projectPriority || "N/A"}</p>
          <p><strong>Progress:</strong> ${Math.round(
            Project.progress || 0
          )}%</p>
          <p><strong>Start Date:</strong> ${
            Project.sDate ? new Date(Project.sDate).toLocaleDateString() : "N/A"
          }</p>
          <p><strong>Due Date:</strong> ${
            Project.dueDate
              ? new Date(Project.dueDate).toLocaleDateString()
              : "N/A"
          }</p>
          <p><strong>Location:</strong> ${Project.location || "N/A"}</p>
        </div>
        
        <div>
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Team & Budget</h3>
          <p><strong>Owner:</strong> ${Project.owner?.name || "N/A"}</p>
          <p><strong>Contractor:</strong> ${
            Project.contractor?.name || "N/A"
          }</p>
          <p><strong>consulta:</strong> ${
            Project.contractor?.name || "N/A"
          }</p>
          <p><strong>Team Members:</strong> ${Project.members?.length || 0}</p>
          ${
            user?.plan?.name === "RequestPlus"
              ? `
            <p><strong>Budget:</strong> ${Project.budget || "N/A"}</p>
            <p><strong>Remaining:</strong> ${Project.remaining || "N/A"}</p>
          `
              : ""
          }
        </div>
      </div>
      
      ${
        tags && tags.length > 0
          ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Tags</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${tags
              .map(
                (tag) => `
              <span style="background: ${
                tag.colorCode || "#ddd"
              }; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px;">
                ${tag.tagName || "Unknown Tag"}
              </span>
            `
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }
      
      ${
        Project.members && Project.members.length > 0
          ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Team Members</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
            ${Project.members
              .map(
                (member) => `
              <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
                <strong>${member.name || "Unknown Member"}</strong>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }
      
      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  `;

  // Create a temporary div to render the HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  tempDiv.style.top = "-9999px";
  tempDiv.style.width = "800px";
  document.body.appendChild(tempDiv);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    // Remove temporary div
    document.body.removeChild(tempDiv);

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const imgData = canvas.toDataURL("image/png");
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(`${Project.name || "project"}_details.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Fallback to simple text-based PDF
    generateSimplePDF(Project, tags, user);
  }
};

// Method 2: Simple text-based PDF (Fallback)
export const generateSimplePDF = (Project, tags, user) => {
  const pdf = new jsPDF();
  let yPosition = 20;

  // Title
  pdf.setFontSize(20);
  pdf.text("Project Details", 20, yPosition);
  yPosition += 15;

  pdf.setFontSize(16);
  pdf.text(Project.name || "Project Name", 20, yPosition);
  yPosition += 15;

  // Description
  pdf.setFontSize(12);
  pdf.text("Description:", 20, yPosition);
  yPosition += 10;

  const description = Project.description || "No description available";
  const splitDescription = pdf.splitTextToSize(description, 170);
  pdf.text(splitDescription, 20, yPosition);
  yPosition += splitDescription.length * 5 + 10;

  // Project Information
  pdf.text("Project Information:", 20, yPosition);
  yPosition += 10;

  const projectInfo = [
    `Status: ${Project.status || "N/A"}`,
    `Priority: ${Project.projectPriority || "N/A"}`,
    `Progress: ${Math.round(Project.progress || 0)}%`,
    `Start Date: ${
      Project.sDate ? new Date(Project.sDate).toLocaleDateString() : "N/A"
    }`,
    `Due Date: ${
      Project.dueDate ? new Date(Project.dueDate).toLocaleDateString() : "N/A"
    }`,
    `Location: ${Project.location || "N/A"}`,
    `Owner: ${Project.owner?.name || "N/A"}`,
    `Contractor: ${Project.contractor?.name || "N/A"}`,
    `consultant: ${Project.consultant?.name || "N/A"}`,
    `Team Members: ${Project.members?.length || 0}`,
  ];

  if (user?.plan?.name === "RequestPlus") {
    projectInfo.push(`Budget: ${Project.budget || "N/A"}`);
    projectInfo.push(`Remaining: ${Project.remaining || "N/A"}`);
  }

  projectInfo.forEach((info) => {
    pdf.text(info, 25, yPosition);
    yPosition += 7;
  });

  // Tags
  if (tags && tags.length > 0) {
    yPosition += 10;
    pdf.text("Tags:", 20, yPosition);
    yPosition += 10;

    tags.forEach((tag) => {
      pdf.text(`• ${tag.tagName || "Unknown Tag"}`, 25, yPosition);
      yPosition += 7;
    });
  }

  // Team Members
  if (Project.members && Project.members.length > 0) {
    yPosition += 10;
    pdf.text("Team Members:", 20, yPosition);
    yPosition += 10;

    Project.members.forEach((member) => {
      pdf.text(`• ${member.name || "Unknown Member"}`, 25, yPosition);
      yPosition += 7;
    });
  }

  // Footer
  pdf.setFontSize(10);
  pdf.text(
    `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
    20,
    280
  );

  pdf.save(`${Project.name || "project"}_details.pdf`);
};

// Method 3: Capture specific element as PDF
export const generatePDFFromElement = async (elementId, filename) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
