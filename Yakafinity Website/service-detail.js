function renderServiceDetail() {
  const data = getSiteData();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const service = data.services.find((item) => item.id === id) || data.services[0];
  if (!service) return;
  const defaultService = DEFAULT_DATA.services.find((item) => item.id === service.id);
  const offerings = (service.offerings || (defaultService && defaultService.offerings) || []).map((item) => ({
    ...item,
    image: item.image || service.image
  }));

  const image = document.getElementById("serviceImagePage");
  image.src = service.image;
  image.alt = service.title;

  document.getElementById("serviceTitlePage").textContent = `${service.icon} ${service.title}`;
  document.getElementById("serviceCategoryPage").textContent = `${service.category} service by ${data.company.name}`;
  document.getElementById("serviceChip").textContent = service.category;
  document.getElementById("serviceHeading").textContent = `${service.icon} ${service.title}`;
  document.getElementById("serviceDescriptionPage").textContent = service.description;
  document.getElementById("serviceFeaturesPage").innerHTML = (service.features || [])
    .map((feature) => `<li>${feature}</li>`)
    .join("");

  const orderButton = document.getElementById("orderThisServiceBtn");
  orderButton.href = window.YakafinityOrderLinks.buildServiceOrderMessage(service.title);
  orderButton.target = "_blank";
  orderButton.rel = "noopener";

  const offeringsRoot = document.getElementById("serviceOfferings");
  offeringsRoot.innerHTML = offerings.length
    ? offerings
        .map(
          (item) => `
          <article class="offering-card">
            <img src="${item.image}" alt="${item.name}" />
            <h3>${item.name}</h3>
            <p class="offering-price">LKR ${Number(item.priceLkr).toLocaleString()}</p>
            <a class="btn" href="${window.YakafinityOrderLinks.buildServiceOrderMessage(service.title, item.name)}" target="_blank" rel="noopener">Order ${item.name}</a>
          </article>
        `
        )
        .join("")
    : `<p class="muted">Pricing details will be updated soon.</p>`;
}

document.addEventListener("DOMContentLoaded", renderServiceDetail);
