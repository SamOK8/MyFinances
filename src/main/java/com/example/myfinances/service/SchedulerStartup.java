package com.example.myfinances.service;

import com.example.myfinances.scheduler.UpdatePricesInDatabase;
import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class SchedulerStartup implements ApplicationRunner {

    private final Scheduler scheduler;

    public SchedulerStartup(Scheduler scheduler) {
        this.scheduler = scheduler;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        JobDetail job = JobBuilder.newJob(UpdatePricesInDatabase.class)
                .withIdentity("printTimeJob")
                .storeDurably()
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("printTimeTrigger")
                .withSchedule(CronScheduleBuilder.cronSchedule("0/30 * * * * ?"))
                .forJob(job)
                .build();

        if (!scheduler.checkExists(job.getKey())) {
            scheduler.scheduleJob(job, trigger);
        }
    }
}

