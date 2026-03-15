package com.example.myfinances.scheduler;

import com.example.myfinances.repositary.PriceRepository;
import com.example.myfinances.service.PriceService;
import lombok.RequiredArgsConstructor;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UpdatePricesInDatabase implements Job {

    @Autowired
    private PriceRepository priceRepository;
    private final PriceService priceService;


    @Override
    public void execute(JobExecutionContext context) {
        System.out.println("UpdatePricesInDatabase executed: " + java.time.OffsetDateTime.now());
            priceService.updatePrices();


    }
}
