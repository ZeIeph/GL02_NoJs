const { VCard } = require('vcards-js');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const vcard = VCard();

rl.question('First name: ', (firstName) => {
  vcard.firstName = firstName;
  rl.question('Last Name: ', (lastName) => {
    vcard.lastName = lastName;
    rl.question('Organization: ', (organization) => {
      vcard.organization = organization;
      rl.question('Email: ', (email) => {
        vcard.email = email;
        rl.question('workPhone: ', (workPhone) => {
          vcard.workPhone = workPhone;
          rl.question('Birthday: ', (birthday) => {
            vcard.birthday = birthday;
          
          
          // Générer le contenu de la vCard
          const vcardContent = vcard.getFormattedString();

          // Enregistrer la vCard dans un fichier
          const fileName = 'VCard.vcf';
          fs.writeFileSync(fileName, vcardContent, 'utf-8');
          console.log(`La vCard est enregistrée dans ${fileName}`);
          
          rl.close();
        });
        });
      });
    });
  });
});
