package com.digital_banking.backend.seeders;

import com.digital_banking.backend.dtos.BankAccountDTO;
import com.digital_banking.backend.dtos.CurrentBankAccountDTO;
import com.digital_banking.backend.dtos.CustomerDTO;
import com.digital_banking.backend.dtos.SavingBankAccountDTO;
import com.digital_banking.backend.exceptions.CustomerNotFoundException;
import com.digital_banking.backend.services.IBankAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Stream;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final IBankAccountService bankAccountService;

    @Override
    public void run(String... args) throws Exception {

        Stream.of("Hassan", "Imane", "Mohamed").forEach(name -> {
            CustomerDTO customer = new CustomerDTO();
            customer.setName(name);
            customer.setEmail(name + "@gmail.com");
            bankAccountService.saveCustomer(customer);
        });

        bankAccountService.listCustomers().forEach(customer -> {
            try {
                bankAccountService.saveCurrentBankAccount(Math.random() * 90000, 9000, customer.getId());
                bankAccountService.saveSavingBankAccount(Math.random() * 120000, 5.5, customer.getId());

            } catch (CustomerNotFoundException e) {
                throw new RuntimeException(e);
            }
        });

        List<BankAccountDTO> bankAccounts = bankAccountService.bankAccountList();
        for (BankAccountDTO bankAccount : bankAccounts) {
            for (int i = 0; i < 10; i++) {
                String accountId;
                if (bankAccount instanceof SavingBankAccountDTO) {
                    accountId = ((SavingBankAccountDTO) bankAccount).getId();
                } else {
                    accountId = ((CurrentBankAccountDTO) bankAccount).getId();
                }
                bankAccountService.credit(accountId, 10000 + Math.random() * 120000, "Credit");
                bankAccountService.debit(accountId, 1000 + Math.random() * 9000, "Debit");
            }
        }
    }
}