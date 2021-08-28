# vaccine_reservation

A vaccine reservation system for patients and medical providers built with [Django REST framework](https://www.django-rest-framework.org) and [React](https://reactjs.org). The frontend uses components from [Chakra UI](https://chakra-ui.com).

Functionalities:
 - Register/login page for patients/providers

![Optional Text](../main/README_images/patient_register.png)
![Optional Text](../main/README_images/provider_register.png)
![Optional Text](../main/README_images/login.png)

 - Patients can enter their availabilities for vaccines after they register:

![Optional Text](../main/README_images/patient_availabilities.png)
![Optional Text](../main/README_images/patient_availabilities.png)

- Providers can enter available appointments and maximum capacity for that time slot:

![Optional Text](../main/README_images/provider_availabilities.png)

 - A matching algorithm is run on the backend, matching patients to available appointments at sites within the max distance they are willing to travel from their home. The patient can then accept/decline the vaccine offer from their dashboard:

![Optional Text](../main/README_images/patient_dashboard.png)

 - The provider can view the status of the appointments from their dashboard:

![Optional Text](../main/README_images/provider_dashboard.png)
