const { VCard } = require('vcards-js');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const VCard = VCard();

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
          
          
          // Générer contenu VCard
          const VCardContent = VCard.getFormattedString();

          // Enregistrement VCard dans un fichier
          const fileName = 'VCard.vcf';
          fs.writeFileSync(fileName, VCardContent, 'utf-8');
          console.log(`La VCard est enregistrée dans ${fileName}`);
          
          rl.close();
        });
        });
      });
    });
  });
});
