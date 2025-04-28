package com.digital_banking.backend.repositories;

import com.digital_banking.backend.entities.CurrentAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CurrentAccountRepository extends JpaRepository<CurrentAccount, String> {
}