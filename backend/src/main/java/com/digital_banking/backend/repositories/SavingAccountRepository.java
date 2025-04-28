package com.digital_banking.backend.repositories;

import com.digital_banking.backend.entities.SavingAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavingAccountRepository extends JpaRepository<SavingAccount, String> {
}