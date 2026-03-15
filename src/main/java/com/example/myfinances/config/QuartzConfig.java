package com.example.myfinances.config;

import com.example.myfinances.scheduler.UpdatePricesInDatabase;
import org.quartz.JobDetail;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.CronTriggerFactoryBean;
import org.springframework.scheduling.quartz.JobDetailFactoryBean;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetailFactoryBean printTimeJobDetail() {
        JobDetailFactoryBean factory = new JobDetailFactoryBean();
        factory.setJobClass(UpdatePricesInDatabase.class);
        factory.setName("printTimeJob");
        factory.setDurability(true);
        return factory;
    }

    @Bean
    public CronTriggerFactoryBean printTimeTrigger(JobDetail printTimeJobDetail) {
        CronTriggerFactoryBean trigger = new CronTriggerFactoryBean();
        trigger.setJobDetail(printTimeJobDetail);
        // every 30 seconds
        trigger.setCronExpression("0 0/5 * * * ?");
        trigger.setName("printTimeTrigger");
        return trigger;
    }
}
